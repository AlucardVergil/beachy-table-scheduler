import { ApiRequest, ApiResponse } from '@/types/api';
import { connectToDatabase } from '@/lib/mongodb';

export default async function handler(req: ApiRequest, res: ApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const db = await connectToDatabase();
    const tableId = parseInt(req.query.id as string);
    const date = req.query.date ? new Date(req.query.date as string) : new Date();

    const table = await db.collection('tables').findOne({ id: tableId });
    if (!table) {
      return res.status(404).json({ message: 'Table not found' });
    }

    const hasReservation = await db.collection('reservations').findOne({
      tableId,
      date: {
        $gte: new Date(date.setHours(0, 0, 0, 0)),
        $lt: new Date(date.setHours(23, 59, 59, 999))
      },
      status: 'active'
    });

    res.status(200).json({
      tableId: table.id,
      isAvailable: !hasReservation,
    });
  } catch (error) {
    console.error('Error fetching table availability:', error);
    res.status(500).json({ message: 'Error fetching table availability' });
  }
}
