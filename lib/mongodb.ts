import { MongoClient, type Db, type MongoClientOptions } from "mongodb"

const uri = process.env.MONGODB_URI
const dbName = process.env.MONGODB_DB

if (!uri) {
  throw new Error("MONGODB_URI is not set")
}

if (!dbName) {
  throw new Error("MONGODB_DB is not set")
}

let cachedClient: MongoClient | null = null
let cachedDb: Db | null = null

const isLocalConnection = uri?.startsWith("mongodb://") && !uri.includes("mongodb+srv://")
const disableSSL = process.env.MONGODB_DISABLE_SSL === "true" || isLocalConnection

const clientOptions: MongoClientOptions = {
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
  connectTimeoutMS: 10000,
  ...(disableSSL && {
    tls: false,
  }),
  ...(!disableSSL && {
    tls: true,
    tlsAllowInvalidCertificates: true,
    tlsInsecure: true,
  }),
}

export async function connectToDatabase() {
  if (cachedClient && cachedDb) {
    try {
      await cachedClient.db("admin").command({ ping: 1 })
      return { client: cachedClient, db: cachedDb }
    } catch {
      cachedClient = null
      cachedDb = null
    }
  }

  try {
    const client = new MongoClient(uri as string, clientOptions)
    await client.connect()
    
    await client.db("admin").command({ ping: 1 })
    
    const db = client.db(dbName)

    cachedClient = client
    cachedDb = db

    return { client, db }
  } catch (error: any) {
    console.error("MongoDB connection error:", error.message)
    throw new Error(`Failed to connect to MongoDB: ${error.message}`)
  }
}




