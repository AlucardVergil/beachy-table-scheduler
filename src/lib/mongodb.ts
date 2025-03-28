import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI || "mongodb+srv://vagelisro:mmsAdv123@cluster0.kgfae.mongodb.net/beachbar?retryWrites=true&w=majority&appName=Cluster0";
const client = new MongoClient(uri);

export async function connectToDatabase() {
  try {
    await client.connect();
    return client.db('beachbar');
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
    throw error;
  }
}

export { client };
