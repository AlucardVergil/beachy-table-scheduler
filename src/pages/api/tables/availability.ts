
import { ApiRequest, ApiResponse } from '@/types/api';
import { connectToDatabase } from '@/lib/mongodb';

export default async function handler(req: ApiRequest, res: ApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const db = await connectToDatabase();
    const tables = await db.collection('tables').find({}).toArray();
    
    const date = req.query.date ? new Date(req.query.date as string) : new Date();
    const reservations = await db.collection('reservations').find({
      date: {
        $gte: new Date(date.setHours(0, 0, 0, 0)),
        $lt: new Date(date.setHours(23, 59, 59, 999))
      },
      status: 'active'
    }).toArray();

    const tablesWithAvailability = tables.map(table => {
      const tableReservations = reservations.filter(r => r.tableId === table.id);
      const bookedHours = new Set(tableReservations.map(r => r.arrivalTime));
      const availableHours = table.availableHours.filter(hour => !bookedHours.has(hour));

      return {
        ...table,
        isAvailable: availableHours.length > 0,
        availableHours
      };
    });

    res.status(200).json(tablesWithAvailability);
  } catch (error) {
    console.error('Error fetching table availability:', error);
    res.status(500).json({ message: 'Error fetching table availability' });
  }
}
