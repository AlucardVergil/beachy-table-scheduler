import { connectToDatabase } from '@/lib/mongodb';
import bcrypt from 'bcryptjs';

async function initializeDatabase() {
  try {
    const db = await connectToDatabase();

    // Create admin user
    const hashedPassword = await bcrypt.hash('admin123', 10);
    await db.collection('admins').insertOne({
      username: 'admin',
      password: hashedPassword,
      createdAt: new Date()
    });

    // Create tables with available hours
    const tables = [
      {
        id: 1,
        seats: 4,
        x: 200,
        y: 10,
        type: 'beach',
        availableHours: ["10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00"]
      },
      {
        id: 2,
        seats: 2,
        x: 320,
        y: 10,
        type: 'beach',
        availableHours: ["10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00"]
      },
      {
        id: 3,
        seats: 6,
        x: 550,
        y: 150,
        type: 'beach',
        availableHours: ["10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00"]
      },
      {
        id: 4,
        seats: 4,
        x: 150,
        y: 350,
        type: 'restaurant',
        availableHours: ["10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00"]
      },
      {
        id: 5,
        seats: 4,
        x: 350,
        y: 350,
        type: 'restaurant',
        availableHours: ["10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00"]
      },
      {
        id: 6,
        seats: 8,
        x: 550,
        y: 350,
        type: 'restaurant',
        availableHours: ["10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00"]
      }
    ];

    await db.collection('tables').insertMany(tables);

    console.log('Database initialized successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error initializing database:', error);
    process.exit(1);
  }
}

initializeDatabase();
