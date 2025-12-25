"use client"

import { Header } from "@/components/dashboard/header"
import { Navigation } from "@/components/dashboard/navigation"
import { DashboardSummary } from "@/components/dashboard/dashboard-summary"
import { useAuth } from "@/lib/auth"

export default function DashboardPage() {
  const { user } = useAuth()
  const isAdmin = user?.role === "admin"

  if (isAdmin) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <Navigation />
        <main className="animate-fade-in">
          <div className="container mx-auto px-4 py-8">
            <div className="text-center py-16 animate-slide-up">
              <p className="text-muted-foreground">Dashboard summary is available for regular users only.</p>
            </div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Navigation />
      <main className="animate-fade-in">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-slide-up">
            <DashboardSummary />
          </div>
        </div>
      </main>
    </div>
  )
}
