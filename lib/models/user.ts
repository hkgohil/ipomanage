import { connectToDatabase } from "@/lib/mongodb"
import bcrypt from "bcryptjs"
import type { ObjectId } from "mongodb"

export interface UserDocument {
  _id?: ObjectId
  name: string
  email: string
  password: string
  role: "admin" | "user"
  encryptedPANs: string[]
  createdAt: string
  updatedAt: string
}

export interface CreateUserInput {
  name: string
  email: string
  password: string
  role?: "admin" | "user"
}

export async function createUser(input: CreateUserInput): Promise<UserDocument> {
  const { db } = await connectToDatabase()
  const hashedPassword = await bcrypt.hash(input.password, 10)

  const user: Omit<UserDocument, "_id"> = {
    name: input.name,
    email: input.email.toLowerCase(),
    password: hashedPassword,
    role: input.role || "user",
    encryptedPANs: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  const result = await db.collection<UserDocument>("users").insertOne(user as UserDocument)
  const createdUser = await db.collection<UserDocument>("users").findOne({ _id: result.insertedId })

  if (!createdUser) {
    throw new Error("Failed to create user")
  }

  return createdUser
}

export async function findUserByEmail(email: string): Promise<UserDocument | null> {
  const { db } = await connectToDatabase()
  return db.collection<UserDocument>("users").findOne({ email: email.toLowerCase() })
}

export async function findUserById(userId: string): Promise<UserDocument | null> {
  const { db } = await connectToDatabase()
  const { ObjectId } = await import("mongodb")
  return db.collection<UserDocument>("users").findOne({ _id: new ObjectId(userId) })
}

export async function verifyPassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(plainPassword, hashedPassword)
}

export async function addPANToUser(userId: string, encryptedPAN: string): Promise<void> {
  const { db } = await connectToDatabase()
  const { ObjectId } = await import("mongodb")
  
  await db.collection<UserDocument>("users").updateOne(
    { _id: new ObjectId(userId) },
    {
      $push: { encryptedPANs: encryptedPAN },
      $set: { updatedAt: new Date().toISOString() },
    }
  )
}

export async function removePANFromUser(userId: string, encryptedPAN: string): Promise<void> {
  const { db } = await connectToDatabase()
  const { ObjectId } = await import("mongodb")
  
  await db.collection<UserDocument>("users").updateOne(
    { _id: new ObjectId(userId) },
    {
      $pull: { encryptedPANs: encryptedPAN },
      $set: { updatedAt: new Date().toISOString() },
    }
  )
}

export async function checkEmailExists(email: string): Promise<boolean> {
  const { db } = await connectToDatabase()
  const user = await db.collection<UserDocument>("users").findOne({ email: email.toLowerCase() })
  return !!user
}

