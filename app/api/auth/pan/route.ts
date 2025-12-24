import { NextRequest, NextResponse } from "next/server"
import { authenticateRequest } from "@/lib/middleware/auth"
import { addPANToUser, removePANFromUser, findUserById } from "@/lib/models/user"
import { encryptPAN, decryptPAN } from "@/lib/pan-encryption"

export async function POST(request: NextRequest) {
  try {
    const authResult = await authenticateRequest(request)

    if ("error" in authResult) {
      return authResult.error
    }

    const body = await request.json()
    const { panCard } = body

    if (!panCard || panCard.length !== 10) {
      return NextResponse.json({ error: "Invalid PAN card format" }, { status: 400 })
    }

    const user = await findUserById(authResult.user.userId)
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const encryptedPAN = encryptPAN(panCard.toUpperCase())

    const existingPANs = user.encryptedPANs.map((enc) => {
      try {
        return decryptPAN(enc)
      } catch {
        return null
      }
    })

    if (existingPANs.includes(panCard.toUpperCase())) {
      return NextResponse.json({ error: "PAN card already exists" }, { status: 409 })
    }

    await addPANToUser(authResult.user.userId, encryptedPAN)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Add PAN error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const authResult = await authenticateRequest(request)

    if ("error" in authResult) {
      return authResult.error
    }

    const body = await request.json()
    const { panCard } = body

    if (!panCard) {
      return NextResponse.json({ error: "PAN card is required" }, { status: 400 })
    }

    const user = await findUserById(authResult.user.userId)
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const panToRemove = user.encryptedPANs.find((enc) => {
      try {
        return decryptPAN(enc) === panCard.toUpperCase()
      } catch {
        return false
      }
    })

    if (!panToRemove) {
      return NextResponse.json({ error: "PAN card not found" }, { status: 404 })
    }

    await removePANFromUser(authResult.user.userId, panToRemove)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Remove PAN error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

