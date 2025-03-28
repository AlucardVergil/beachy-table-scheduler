import { ApiRequest, ApiResponse } from '@/types/api';
import { connectToDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import type { Reservation } from '@/types';

export default async function handler(req: ApiRequest, res: ApiResponse) {
  const db = await connectToDatabase();

  if (req.method === 'GET') {
    try {
      const reservations = await db
        .collection('reservations')
        .find({})
        .sort({ date: -1 })
        .toArray();
      res.status(200).json(reservations);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching reservations' });
    }
  } else if (req.method === 'POST') {
    try {
      const { tableId, date, timeSlot, name, email, phone, type, paymentStatus } = req.body;

      // Validate required fields
      if (!tableId || !date || !name || !email || !phone || !type) {
        return res.status(400).json({ message: 'Missing required fields' });
      }

      // Check if table exists and is available
      const table = await db.collection('tables').findOne({ id: tableId });
      if (!table) {
        return res.status(404).json({ message: 'Table not found' });
      }

      // Check if table is already reserved for this date
      const existingReservation = await db.collection('reservations').findOne({
        tableId,
        date: {
          $gte: new Date(new Date(date).setHours(0, 0, 0, 0)),
          $lt: new Date(new Date(date).setHours(23, 59, 59, 999))
        },
        status: 'active'
      });

      if (existingReservation) {
        return res.status(400).json({ message: 'Table is already reserved for this date' });
      }

      // Create reservation
      const reservation: Omit<Reservation, '_id'> = {
        tableId,
        date: new Date(date),
        timeSlot: type === 'restaurant' ? timeSlot : null,
        name,
        email,
        phone,
        type,
        status: 'active',
        paymentStatus: paymentStatus || 'not_required'
      };

      const result = await db.collection('reservations').insertOne(reservation);
      res.status(201).json({ ...reservation, _id: result.insertedId });
    } catch (error) {
      console.error('Error creating reservation:', error);
      res.status(500).json({ message: 'Error creating reservation' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
