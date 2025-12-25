"use client"

import { Header } from "@/components/dashboard/header"
import { Navigation } from "@/components/dashboard/navigation"
import { IPOList } from "@/components/dashboard/ipo-list"

export default function IPOsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Navigation />
      <main className="animate-fade-in">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-slide-up">
            <IPOList />
          </div>
        </div>
      </main>
    </div>
  )
}
