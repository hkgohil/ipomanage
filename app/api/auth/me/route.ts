import { NextRequest, NextResponse } from "next/server"
import { authenticateRequest } from "@/lib/middleware/auth"
import { findUserById } from "@/lib/models/user"
import { decryptPAN } from "@/lib/pan-encryption"

export async function GET(request: NextRequest) {
  try {
    const authResult = await authenticateRequest(request)

    if ("error" in authResult) {
      return authResult.error
    }

    const user = await findUserById(authResult.user.userId)

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const decryptedPANs = user.encryptedPANs.map((encrypted) => {
      try {
        return decryptPAN(encrypted)
      } catch {
        return null
      }
    }).filter((pan): pan is string => pan !== null)

    return NextResponse.json({
      user: {
        id: user._id!.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
        panCards: decryptedPANs,
      },
    })
  } catch (error) {
    console.error("Get user error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

