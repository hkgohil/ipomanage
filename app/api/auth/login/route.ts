import { NextRequest, NextResponse } from "next/server"
import { findUserByEmail, verifyPassword } from "@/lib/models/user"
import { generateToken } from "@/lib/jwt"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    const user = await findUserByEmail(email)

    if (!user) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 })
    }

    const isValidPassword = await verifyPassword(password, user.password)

    if (!isValidPassword) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 })
    }

    const token = generateToken({
      userId: user._id!.toString(),
      email: user.email,
      role: user.role,
    })

    return NextResponse.json({
      success: true,
      token,
      user: {
        id: user._id!.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
      },
    })
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

