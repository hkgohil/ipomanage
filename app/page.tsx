"use client"

import { useAuth } from "@/lib/auth"
import { LoginForm } from "@/components/auth/login-form"
import { Header } from "@/components/dashboard/header"
import { Navigation } from "@/components/dashboard/navigation"
import { DashboardSummary } from "@/components/dashboard/dashboard-summary"
import { PanSection } from "@/components/dashboard/pan-section"
import { MyApplications } from "@/components/dashboard/my-applications"
import { AllotmentChecker } from "@/components/dashboard/allotment-checker"
import { IPOList } from "@/components/dashboard/ipo-list"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, TrendingUp, CreditCard, FileText, Search } from "lucide-react"
import { Card } from "@/components/ui/card"

export default function Home() {
  const { user } = useAuth()

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background via-muted/20 to-background">
        <LoginForm />
      </div>
    )
  }

  const isAdmin = user?.role === "admin"

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Navigation />
      <main className="animate-fade-in">
        <div className="container mx-auto px-4 py-8 space-y-8">
          <div className="animate-slide-up">
            <div className="mb-8">
              <h1 className="text-4xl font-bold tracking-tight mb-2 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                Welcome back, {user.name || user.email?.split("@")[0]}!
              </h1>
              <p className="text-muted-foreground text-lg">
                Track your IPO applications and manage your investments
              </p>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 animate-slide-up" style={{ animationDelay: "100ms" }}>
            <Link href="/ipos">
              <Card className="p-6 h-full hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer group">
                <div className="flex items-start justify-between mb-4">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <TrendingUp className="h-6 w-6 text-primary" />
                  </div>
                  <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Mainboard IPOs</h3>
                <p className="text-sm text-muted-foreground">
                  Browse and track all available mainboard IPOs
                </p>
              </Card>
            </Link>

            {!isAdmin && (
              <>
                <Link href="/dashboard">
                  <Card className="p-6 h-full hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer group">
                    <div className="flex items-start justify-between mb-4">
                      <div className="h-12 w-12 rounded-lg bg-blue-500/10 flex items-center justify-center group-hover:bg-blue-500/20 transition-colors">
                        <FileText className="h-6 w-6 text-blue-500" />
                      </div>
                      <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">Dashboard</h3>
                    <p className="text-sm text-muted-foreground">
                      View your investment summary and statistics
                    </p>
                  </Card>
                </Link>

                <Link href="/pan">
                  <Card className="p-6 h-full hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer group">
                    <div className="flex items-start justify-between mb-4">
                      <div className="h-12 w-12 rounded-lg bg-green-500/10 flex items-center justify-center group-hover:bg-green-500/20 transition-colors">
                        <CreditCard className="h-6 w-6 text-green-500" />
                      </div>
                      <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-green-500 group-hover:translate-x-1 transition-all" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">PAN Cards</h3>
                    <p className="text-sm text-muted-foreground">
                      Manage your PAN cards for allotment checking
                    </p>
                  </Card>
                </Link>

                <Link href="/applications">
                  <Card className="p-6 h-full hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer group">
                    <div className="flex items-start justify-between mb-4">
                      <div className="h-12 w-12 rounded-lg bg-purple-500/10 flex items-center justify-center group-hover:bg-purple-500/20 transition-colors">
                        <FileText className="h-6 w-6 text-purple-500" />
                      </div>
                      <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-purple-500 group-hover:translate-x-1 transition-all" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">My Applications</h3>
                    <p className="text-sm text-muted-foreground">
                      Track all your IPO applications
                    </p>
                  </Card>
                </Link>
              </>
            )}

            <Link href="/allotment">
              <Card className="p-6 h-full hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer group">
                <div className="flex items-start justify-between mb-4">
                  <div className="h-12 w-12 rounded-lg bg-orange-500/10 flex items-center justify-center group-hover:bg-orange-500/20 transition-colors">
                    <Search className="h-6 w-6 text-orange-500" />
                  </div>
                  <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-orange-500 group-hover:translate-x-1 transition-all" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Allotment Checker</h3>
                <p className="text-sm text-muted-foreground">
                  Check IPO allotment status instantly
                </p>
              </Card>
            </Link>
          </div>

          <div className="animate-slide-up" style={{ animationDelay: "200ms" }}>
            <div className="mb-6">
              <h2 className="text-2xl font-semibold mb-2">Quick Overview</h2>
              <p className="text-muted-foreground">Navigate to dedicated pages for full details</p>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <div className="md:col-span-2 lg:col-span-1">
                <div className="h-48 rounded-lg border border-border bg-muted/30 flex items-center justify-center">
                  <div className="text-center">
                    <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">View all IPOs</p>
                    <Button asChild variant="outline" className="mt-2">
                      <Link href="/ipos">Go to IPOs <ArrowRight className="ml-2 h-4 w-4" /></Link>
                    </Button>
                  </div>
                </div>
              </div>
              {!isAdmin && (
                <>
                  <div className="h-48 rounded-lg border border-border bg-muted/30 flex items-center justify-center">
                    <div className="text-center">
                      <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">View dashboard</p>
                      <Button asChild variant="outline" className="mt-2">
                        <Link href="/dashboard">Go to Dashboard <ArrowRight className="ml-2 h-4 w-4" /></Link>
                      </Button>
                    </div>
                  </div>
                  <div className="h-48 rounded-lg border border-border bg-muted/30 flex items-center justify-center">
                    <div className="text-center">
                      <CreditCard className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">Manage PAN cards</p>
                      <Button asChild variant="outline" className="mt-2">
                        <Link href="/pan">Go to PAN <ArrowRight className="ml-2 h-4 w-4" /></Link>
                      </Button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}