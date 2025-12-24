import { NextRequest, NextResponse } from "next/server"
import { authenticateRequest } from "@/lib/middleware/auth"
import { deleteApplication } from "@/lib/models/application"

interface RouteParams {
  params: {
    id: string
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const authResult = await authenticateRequest(request)

    if ("error" in authResult) {
      return authResult.error
    }

    const { id } = params
    const deleted = await deleteApplication(id, authResult.user.userId)

    if (!deleted) {
      return NextResponse.json({ error: "Application not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Delete application error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

