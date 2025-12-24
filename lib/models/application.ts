import { connectToDatabase } from "@/lib/mongodb"
import type { ObjectId } from "mongodb"

export interface ApplicationDocument {
  _id?: ObjectId
  userId: string
  ipoId: string
  ipoName: string
  amount: number
  panUsed: string
  appliedFrom: "own" | "friend"
  friendName?: string
  appliedDate: string
  createdAt: string
  updatedAt: string
}

export interface CreateApplicationInput {
  userId: string
  ipoId: string
  ipoName: string
  amount: number
  panUsed: string
  appliedFrom: "own" | "friend"
  friendName?: string
  appliedDate: string
}

export async function createApplication(input: CreateApplicationInput): Promise<ApplicationDocument> {
  const { db } = await connectToDatabase()

  const application: Omit<ApplicationDocument, "_id"> = {
    ...input,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  const result = await db.collection<ApplicationDocument>("applications").insertOne(application as ApplicationDocument)
  const created = await db.collection<ApplicationDocument>("applications").findOne({ _id: result.insertedId })

  if (!created) {
    throw new Error("Failed to create application")
  }

  return created
}

export async function findApplicationsByUserId(userId: string): Promise<ApplicationDocument[]> {
  const { db } = await connectToDatabase()
  return db.collection<ApplicationDocument>("applications").find({ userId }).sort({ appliedDate: -1 }).toArray()
}

export async function deleteApplication(applicationId: string, userId: string): Promise<boolean> {
  const { db } = await connectToDatabase()
  const { ObjectId } = await import("mongodb")
  
  const result = await db.collection<ApplicationDocument>("applications").deleteOne({
    _id: new ObjectId(applicationId),
    userId,
  })

  return result.deletedCount === 1
}

