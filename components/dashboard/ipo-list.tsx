"use client"

import { useState } from "react"
import { IPOCard } from "./ipo-card"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { AddIPODialog } from "./add-ipo-dialog"
import { useIPOStore } from "@/lib/ipo-store"
import { useAuth } from "@/lib/auth"

export function IPOList() {
  const [addDialogOpen, setAddDialogOpen] = useState(false)
  const { ipos } = useIPOStore()
  const { user } = useAuth()
  const isAdmin = user?.role === "admin"

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-semibold tracking-tight text-balance">Mainboard IPOs</h2>
          <p className="text-muted-foreground mt-1">
            {ipos.length} {ipos.length === 1 ? "IPO" : "IPOs"} available
          </p>
        </div>
        {isAdmin && (
          <Button onClick={() => setAddDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add IPO
          </Button>
        )}
      </div>

      {ipos.length === 0 ? (
        <div className="text-center py-16 animate-fade-in">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-muted mb-4">
            <Plus className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-medium mb-2">No IPOs yet</h3>
          <p className="text-muted-foreground mb-6 max-w-sm mx-auto text-pretty">
            {isAdmin ? "Add your first IPO to start tracking" : "No IPOs available at the moment"}
          </p>
          {isAdmin && (
            <Button onClick={() => setAddDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add First IPO
            </Button>
          )}
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {ipos.map((ipo, index) => (
            <div key={ipo.id} className="animate-slide-up" style={{ animationDelay: `${index * 50}ms` }}>
              <IPOCard ipo={ipo} />
            </div>
          ))}
        </div>
      )}

      {isAdmin && <AddIPODialog open={addDialogOpen} onOpenChange={setAddDialogOpen} />}
    </div>
  )
}
