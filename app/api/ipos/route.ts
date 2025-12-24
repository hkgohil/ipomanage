import { NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import { requireAdmin } from "@/lib/middleware/auth"
import type { IPO } from "@/lib/ipo-store"

export async function GET() {
  try {
    const { db } = await connectToDatabase()
    const items = await db.collection("ipos").find().sort({ createdAt: -1 }).toArray()

    const ipos: IPO[] = items.map((item) => ({
      id: item._id.toString(),
      name: item.name,
      openDate: item.openDate,
      closeDate: item.closeDate,
      issueSize: item.issueSize,
      retailPortion: item.retailPortion,
      greyMarketPremium: item.greyMarketPremium,
      recommendation: item.recommendation,
      allotmentLink: item.allotmentLink,
      allotmentDate: item.allotmentDate,
      status: item.status,
    }))

    return NextResponse.json({ ipos })
  } catch (error: any) {
    console.error("Error fetching IPOs:", error)
    return NextResponse.json(
      { error: error.message || "Failed to fetch IPOs" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  const authResult = await requireAdmin(request)
  
  if ("error" in authResult) {
    return authResult.error
  }

  const body = await request.json()

  const ipoInput: Omit<IPO, "id"> = {
    name: body.name,
    openDate: body.openDate,
    closeDate: body.closeDate,
    issueSize: body.issueSize,
    retailPortion: body.retailPortion,
    greyMarketPremium: body.greyMarketPremium,
    recommendation: body.recommendation,
    allotmentLink: body.allotmentLink,
    allotmentDate: body.allotmentDate,
    status: body.status,
  }

  const { db } = await connectToDatabase()
  const result = await db.collection("ipos").insertOne({
    ...ipoInput,
    createdAt: new Date().toISOString(),
  })

  const ipo: IPO = {
    ...ipoInput,
    id: result.insertedId.toString(),
  }

  return NextResponse.json({ ipo }, { status: 201 })
}




