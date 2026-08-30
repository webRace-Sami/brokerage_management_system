import { MongoClient, Db } from 'mongodb';

const uri = process.env.MONGODB_URI || process.env.DATABASE_URL || '';
const options = {};

let client: MongoClient | null = null;
let clientPromise: Promise<MongoClient> | null = null;

declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

if (uri && uri.startsWith('mongodb')) {
  if (process.env.NODE_ENV === 'development') {
    if (!global._mongoClientPromise) {
      client = new MongoClient(uri, options);
      global._mongoClientPromise = client.connect();
    }
    clientPromise = global._mongoClientPromise;
  } else {
    client = new MongoClient(uri, options);
    clientPromise = client.connect();
  }
}

export async function getMongoDb(): Promise<Db | null> {
  if (!clientPromise) return null;
  try {
    const client = await clientPromise;
    return client.db('madina_goods_db');
  } catch (error) {
    console.error('Failed to connect to MongoDB Atlas:', error);
    return null;
  }
}

export default clientPromise;
