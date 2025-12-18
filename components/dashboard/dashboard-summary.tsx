"use client"

import { useAuth } from "@/lib/auth"
import { useApplicationStore } from "@/lib/application-store"
import { Card } from "@/components/ui/card"
import { TrendingUp, Wallet, Users } from "lucide-react"

export function DashboardSummary() {
  const { user } = useAuth()
  const { getApplicationsByUser } = useApplicationStore()

  if (!user) return null

  const applications = getApplicationsByUser(user.id)
  const totalAmount = applications.reduce((sum, app) => sum + app.amount, 0)
  const ownAccountAmount = applications
    .filter((app) => app.appliedFrom === "own")
    .reduce((sum, app) => sum + app.amount, 0)
  const friendAccountAmount = applications
    .filter((app) => app.appliedFrom === "friend")
    .reduce((sum, app) => sum + app.amount, 0)

  const stats = [
    {
      label: "Total IPOs Applied",
      value: applications.length,
      icon: TrendingUp,
      subtext: `${applications.length} ${applications.length === 1 ? "application" : "applications"}`,
    },
    {
      label: "Total Amount Invested",
      value: `₹${totalAmount.toLocaleString("en-IN")}`,
      icon: Wallet,
      subtext: `Across ${applications.length} IPO${applications.length === 1 ? "" : "s"}`,
    },
    {
      label: "Investment Breakdown",
      value: `${applications.filter((a) => a.appliedFrom === "own").length} Own`,
      icon: Users,
      subtext: `${applications.filter((a) => a.appliedFrom === "friend").length} Friend${applications.filter((a) => a.appliedFrom === "friend").length === 1 ? "" : "s"}`,
    },
  ]

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-3xl font-semibold tracking-tight text-balance">Dashboard Summary</h2>
        <p className="text-muted-foreground mt-1">Overview of your IPO investments</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {stats.map((stat, index) => (
          <Card
            key={stat.label}
            className="p-6 animate-slide-up hover:shadow-md transition-shadow"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <p className="text-2xl font-semibold tracking-tight">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.subtext}</p>
              </div>
              <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center">
                <stat.icon className="h-5 w-5 text-muted-foreground" />
              </div>
            </div>
          </Card>
        ))}
      </div>

      {applications.length > 0 && (
        <Card className="p-6 animate-fade-in">
          <h3 className="font-medium mb-4">Investment Distribution</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Own Account</span>
              <span className="text-sm font-medium">₹{ownAccountAmount.toLocaleString("en-IN")}</span>
            </div>
            {friendAccountAmount > 0 && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Friend/Family Accounts</span>
                <span className="text-sm font-medium">₹{friendAccountAmount.toLocaleString("en-IN")}</span>
              </div>
            )}
            <div className="pt-3 border-t border-border">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Total Invested</span>
                <span className="text-base font-semibold">₹{totalAmount.toLocaleString("en-IN")}</span>
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  )
}
