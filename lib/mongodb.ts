import { MongoClient, Db } from 'mongodb';

const uri =
  process.env.DATABASE_URL ||
  process.env.MONGODB_URI ||
  'mongodb+srv://samiullahnawaz942_db_user:SIAoT6epgg4zQ4Ne@cluster0.nbg7m9s.mongodb.net/madina_goods_db?retryWrites=true&w=majority&appName=Cluster0';

const options = {
  serverSelectionTimeoutMS: 5000,
  connectTimeoutMS: 5000,
};

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
    if (!global._mongoClientPromise) {
      client = new MongoClient(uri, options);
      global._mongoClientPromise = client.connect();
    }
    clientPromise = global._mongoClientPromise;
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
