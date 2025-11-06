import { MongoClient } from 'mongodb';

const MONGO_URL = process.env.MONGO_URL;

if (!MONGO_URL) {
  throw new Error('Please define the MONGO_URL environment variable inside .env');
}

let cachedClient = null;
let cachedDb = null;

async function connectToDatabase() {
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }

  const client = await MongoClient.connect(MONGO_URL);

  const db = client.db('swissalpine');
  
  cachedClient = client;
  cachedDb = db;

  return { client, db };
}

const clientPromise = connectToDatabase().then(({ client }) => client);

export default clientPromise;