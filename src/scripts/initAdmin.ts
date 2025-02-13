
import { connectToDatabase } from '@/lib/mongodb';
import bcrypt from 'bcryptjs';

async function createAdmin() {
  try {
    const db = await connectToDatabase();
    
    // Check if admin already exists
    const existingAdmin = await db.collection('admins').findOne({ username: 'admin' });
    if (existingAdmin) {
      console.log('Admin user already exists');
      return;
    }

    // Create admin user with hashed password
    const hashedPassword = await bcrypt.hash('admin123', 10);
    await db.collection('admins').insertOne({
      username: 'admin',
      password: hashedPassword,
      createdAt: new Date()
    });

    console.log('Admin user created successfully');
    console.log('Username: admin');
    console.log('Password: admin123');
  } catch (error) {
    console.error('Error creating admin user:', error);
  } finally {
    process.exit();
  }
}

createAdmin();
