"use client"

import { Header } from "@/components/dashboard/header"
import { Navigation } from "@/components/dashboard/navigation"
import { AllotmentChecker } from "@/components/dashboard/allotment-checker"

export default function AllotmentPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Navigation />
      <main className="animate-fade-in">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-slide-up">
            <AllotmentChecker />
          </div>
        </div>
      </main>
    </div>
  )
}
