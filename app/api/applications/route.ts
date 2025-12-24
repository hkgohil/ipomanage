import { NextRequest, NextResponse } from "next/server"
import { authenticateRequest } from "@/lib/middleware/auth"
import { createApplication, findApplicationsByUserId } from "@/lib/models/application"
import type { IPOApplication } from "@/lib/application-store"

export async function GET(request: NextRequest) {
  try {
    const authResult = await authenticateRequest(request)

    if ("error" in authResult) {
      return authResult.error
    }

    const applications = await findApplicationsByUserId(authResult.user.userId)

    const formatted: IPOApplication[] = applications.map((app) => ({
      id: app._id!.toString(),
      userId: app.userId,
      ipoId: app.ipoId,
      ipoName: app.ipoName,
      amount: app.amount,
      panUsed: app.panUsed,
      appliedFrom: app.appliedFrom,
      friendName: app.friendName,
      appliedDate: app.appliedDate,
    }))

    return NextResponse.json({ applications: formatted })
  } catch (error) {
    console.error("Get applications error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const authResult = await authenticateRequest(request)

    if ("error" in authResult) {
      return authResult.error
    }

    const body = await request.json()
    const { ipoId, ipoName, amount, panUsed, appliedFrom, friendName, appliedDate } = body

    if (!ipoId || !ipoName || !amount || !panUsed || !appliedDate) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const application = await createApplication({
      userId: authResult.user.userId,
      ipoId,
      ipoName,
      amount: Number.parseFloat(amount),
      panUsed,
      appliedFrom: appliedFrom || "own",
      friendName: appliedFrom === "friend" ? friendName : undefined,
      appliedDate,
    })

    const formatted: IPOApplication = {
      id: application._id!.toString(),
      userId: application.userId,
      ipoId: application.ipoId,
      ipoName: application.ipoName,
      amount: application.amount,
      panUsed: application.panUsed,
      appliedFrom: application.appliedFrom,
      friendName: application.friendName,
      appliedDate: application.appliedDate,
    }

    return NextResponse.json({ application: formatted }, { status: 201 })
  } catch (error) {
    console.error("Create application error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

