
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
      const isReserved = reservations.some(r => r.tableId === table.id);

      return {
        id: table.id,
        seats: table.seats,
        x: table.x,  // Ensure x-position is included
        y: table.y,  // Ensure y-position is included
        type: table.type || 'restaurant', // Default to 'restaurant' if type is missing
        isAvailable: !isReserved
      };
    });

    res.status(200).json(tablesWithAvailability);
  } catch (error) {
    console.error('Error fetching table availability:', error);
    res.status(500).json({ message: 'Error fetching table availability' });
  }
}
