import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const pan = searchParams.get("pan")

    if (!pan || pan.length !== 10) {
      return NextResponse.json({ error: "Invalid PAN format" }, { status: 400 })
    }

    await new Promise((resolve) => setTimeout(resolve, 500))

    const mockNames: Record<string, string> = {
      "ABCDE1234F": "Rajesh Kumar",
      "FGHIJ5678K": "Priya Sharma",
      "LMNOP9012Q": "Amit Patel",
      "RSTUV3456W": "Sneha Reddy",
      "WXYZA7890B": "Vikram Singh",
    }

    const name = mockNames[pan] || null

    if (name) {
      return NextResponse.json({ name, success: true })
    }

    return NextResponse.json({ 
      message: "Name not found in database. Please enter manually.",
      success: false 
    })
  } catch (error) {
    console.error("PAN verification error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
