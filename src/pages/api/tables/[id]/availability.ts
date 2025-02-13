
import { ApiRequest, ApiResponse } from '@/types/api';
import { connectToDatabase } from '@/lib/mongodb';

export default async function handler(req: ApiRequest, res: ApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const db = await connectToDatabase();
    const { id } = req.params;
    const date = req.query.date ? new Date(req.query.date as string) : new Date();

    const table = await db.collection('tables').findOne({ id: parseInt(id) });
    if (!table) {
      return res.status(404).json({ message: 'Table not found' });
    }

    const reservations = await db.collection('reservations').find({
      tableId: parseInt(id),
      date: {
        $gte: new Date(date.setHours(0, 0, 0, 0)),
        $lt: new Date(date.setHours(23, 59, 59, 999))
      },
      status: 'active'
    }).toArray();

    const bookedHours = new Set(reservations.map(r => r.arrivalTime));
    const availableHours = table.availableHours.filter(hour => !bookedHours.has(hour));

    res.status(200).json({
      tableId: table.id,
      availableHours
    });
  } catch (error) {
    console.error('Error fetching table availability:', error);
    res.status(500).json({ message: 'Error fetching table availability' });
  }
}
