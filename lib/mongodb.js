import { MongoClient } from 'mongodb';

const MONGO_URL = process.env.MONGO_URL;
const MONGO_DB_NAME = process.env.MONGO_DB_NAME || 'swissalpine';

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

  const db = client.db(MONGO_DB_NAME);
  
  cachedClient = client;
  cachedDb = db;

  return { client, db };
}

const clientPromise = connectToDatabase().then(({ client }) => client);

export default clientPromise;