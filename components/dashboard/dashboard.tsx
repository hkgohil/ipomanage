"use client"

import { Header } from "./header"
import { IPOList } from "./ipo-list"
import { AllotmentChecker } from "./allotment-checker"
import { MyApplications } from "./my-applications"
import { DashboardSummary } from "./dashboard-summary"
import { useAuth } from "@/lib/auth"

export function Dashboard() {
  const { user } = useAuth()
  const isAdmin = user?.role === "admin"

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="animate-fade-in">
        <div className="container mx-auto px-4 py-8 space-y-8">
          {!isAdmin && (
            <>
              <DashboardSummary />
              <MyApplications />
            </>
          )}
          <AllotmentChecker />
          <IPOList />
        </div>
      </main>
    </div>
  )
}
