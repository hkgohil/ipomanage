import { NextRequest, NextResponse } from "next/server"
import { ObjectId } from "mongodb"
import { connectToDatabase } from "@/lib/mongodb"
import { requireAdmin } from "@/lib/middleware/auth"
import type { IPO } from "@/lib/ipo-store"

interface RouteParams {
  params: {
    id: string
  }
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  const authResult = await requireAdmin(request)
  
  if ("error" in authResult) {
    return authResult.error
  }

  const { id } = params
  const body = await request.json()

  const { db } = await connectToDatabase()
  await db
    .collection("ipos")
    .updateOne({ _id: new ObjectId(id) }, { $set: { ...body, updatedAt: new Date().toISOString() } })

  const updated = await db.collection("ipos").findOne({ _id: new ObjectId(id) })

  if (!updated) {
    return NextResponse.json({ error: "IPO not found" }, { status: 404 })
  }

  const ipo: IPO = {
    id: updated._id.toString(),
    name: updated.name,
    openDate: updated.openDate,
    closeDate: updated.closeDate,
    issueSize: updated.issueSize,
    retailPortion: updated.retailPortion,
    greyMarketPremium: updated.greyMarketPremium,
    recommendation: updated.recommendation,
    allotmentLink: updated.allotmentLink,
    allotmentDate: updated.allotmentDate,
    status: updated.status,
  }

  return NextResponse.json({ ipo })
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  const authResult = await requireAdmin(request)
  
  if ("error" in authResult) {
    return authResult.error
  }

  const { id } = params

  const { db } = await connectToDatabase()
  await db.collection("ipos").deleteOne({ _id: new ObjectId(id) })

  return NextResponse.json({ success: true })
}




