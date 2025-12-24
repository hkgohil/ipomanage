import { NextRequest, NextResponse } from "next/server"
import { verifyToken, getTokenFromRequest, type JWTPayload } from "@/lib/jwt"

export interface AuthenticatedRequest extends NextRequest {
  user?: JWTPayload
}

export async function authenticateRequest(request: NextRequest): Promise<{ user: JWTPayload } | { error: NextResponse }> {
  const token = getTokenFromRequest(request)

  if (!token) {
    return {
      error: NextResponse.json({ error: "Unauthorized - No token provided" }, { status: 401 }),
    }
  }

  const payload = verifyToken(token)

  if (!payload) {
    return {
      error: NextResponse.json({ error: "Unauthorized - Invalid token" }, { status: 401 }),
    }
  }

  return { user: payload }
}

export async function requireAdmin(request: NextRequest): Promise<{ user: JWTPayload } | { error: NextResponse }> {
  const authResult = await authenticateRequest(request)

  if ("error" in authResult) {
    return authResult
  }

  if (authResult.user.role !== "admin") {
    return {
      error: NextResponse.json({ error: "Forbidden - Admin access required" }, { status: 403 }),
    }
  }

  return authResult
}

