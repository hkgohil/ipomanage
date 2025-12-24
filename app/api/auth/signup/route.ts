import { NextRequest, NextResponse } from "next/server"
import { createUser, checkEmailExists } from "@/lib/models/user"
import { generateToken } from "@/lib/jwt"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, password } = body

    if (!name || !email || !password) {
      return NextResponse.json({ error: "Name, email, and password are required" }, { status: 400 })
    }

    if (password.length < 6) {
      return NextResponse.json({ error: "Password must be at least 6 characters" }, { status: 400 })
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Invalid email format" }, { status: 400 })
    }

    const emailExists = await checkEmailExists(email)
    if (emailExists) {
      return NextResponse.json({ error: "User already exists. Please sign in." }, { status: 409 })
    }

    const adminEmail = process.env.ADMIN_EMAIL?.toLowerCase().trim()
    const isAdmin = adminEmail && email.toLowerCase().trim() === adminEmail

    const user = await createUser({
      name,
      email,
      password,
      role: isAdmin ? "admin" : "user",
    })

    const token = generateToken({
      userId: user._id!.toString(),
      email: user.email,
      role: user.role,
    })

    return NextResponse.json(
      {
        success: true,
        token,
        user: {
          id: user._id!.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
        },
      },
      { status: 201 }
    )
  } catch (error) {
    console.error("Signup error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

