
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { connectToDatabase } from '@/lib/mongodb';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const db = await connectToDatabase();
    const date = req.query.date ? new Date(req.query.date as string) : new Date();

    const tables = await db.collection('tables').find().toArray();
    const reservations = await db.collection('reservations').find({
      date: {
        $gte: new Date(date.setHours(0, 0, 0, 0)),
        $lt: new Date(date.setHours(23, 59, 59, 999))
      },
      status: 'active'
    }).toArray();

    const availableTables = tables.map(table => ({
      ...table,
      isAvailable: !reservations.some(r => r.tableId === table.id)
    }));

    res.status(200).json(availableTables);
  } catch (error) {
    console.error('Error fetching tables:', error);
    res.status(500).json({ message: 'Error fetching tables' });
  }
}
