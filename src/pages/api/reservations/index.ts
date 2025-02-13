
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
      const reservation: Omit<Reservation, '_id'> = {
        ...req.body,
        date: new Date(req.body.date),
        status: 'active',
      };

      const result = await db.collection('reservations').insertOne(reservation);
      res.status(201).json({ ...reservation, _id: result.insertedId });
    } catch (error) {
      res.status(500).json({ message: 'Error creating reservation' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
