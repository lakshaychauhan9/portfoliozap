import { MongoClient, MongoClientOptions, Db } from "mongodb";

// Define interface for global type augmentation
interface GlobalWithMongo {
  _mongoClientPromise?: Promise<MongoClient>;
}

// Declare global type
declare const global: GlobalWithMongo;

const uri = process.env.MONGODB_URI as string;
const options: MongoClientOptions = {
  maxPoolSize: 10, // Connection pooling for scalability
  minPoolSize: 2,
  connectTimeoutMS: 5000, // Fail fast if no server
};

if (!uri) {
  throw new Error("Please add your MongoDB URI to .env.local");
}

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === "development") {
  // In development, use a global variable to preserve connection across hot reloads
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect().catch((error) => {
      console.error("MongoDB client connection failed:", error);
      throw error;
    });
  }
  clientPromise = global._mongoClientPromise;
} else {
  // In production, create a new client
  client = new MongoClient(uri, options);
  clientPromise = client.connect().catch((error) => {
    console.error("MongoDB client connection failed:", error);
    throw error;
  });
}

// Get database instance
export async function getDb(): Promise<Db> {
  const client = await clientPromise;
  return client.db("portfoliozap");
}

// Test MongoDB connection with a ping
export async function testMongoConnection(): Promise<boolean> {
  try {
    const client = await clientPromise;
    await client.db("portfoliozap").command({ ping: 1 });
    console.log("MongoDB connection successful");
    return true;
  } catch (error: unknown) {
    console.error("MongoDB connection failed:", {
      message: (error as Error).message,
      code: (error as { code?: string }).code,
      name: (error as Error).name,
      stack: (error as Error).stack,
    });
    return false;
  }
}

export default clientPromise;
