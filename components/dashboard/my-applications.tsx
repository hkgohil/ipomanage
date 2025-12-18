"use client"

import { useState } from "react"
import { useAuth } from "@/lib/auth"
import { useApplicationStore } from "@/lib/application-store"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Trash2 } from "lucide-react"
import { AddApplicationDialog } from "./add-application-dialog"
import { Badge } from "@/components/ui/badge"

export function MyApplications() {
  const { user } = useAuth()
  const { getApplicationsByUser, deleteApplication } = useApplicationStore()
  const [addDialogOpen, setAddDialogOpen] = useState(false)

  if (!user) return null

  const applications = getApplicationsByUser(user.id)

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-semibold tracking-tight text-balance">My IPO Applications</h2>
          <p className="text-muted-foreground mt-1">Track your personal IPO investments</p>
        </div>
        <Button onClick={() => setAddDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Application
        </Button>
      </div>

      {applications.length === 0 ? (
        <Card className="p-12 text-center animate-fade-in">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-muted mb-4">
            <Plus className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-medium mb-2">No applications yet</h3>
          <p className="text-muted-foreground mb-6 max-w-sm mx-auto text-pretty">
            Start tracking your IPO applications to monitor your investments
          </p>
          <Button onClick={() => setAddDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add First Application
          </Button>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {applications.map((application, index) => (
            <Card
              key={application.id}
              className="p-6 animate-slide-up hover:shadow-md transition-shadow"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <h3 className="font-semibold text-lg">{application.ipoName}</h3>
                    <p className="text-sm text-muted-foreground">
                      Applied on{" "}
                      {new Date(application.appliedDate).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deleteApplication(application.id)}
                    className="h-8 w-8"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Amount Invested</span>
                    <span className="text-base font-semibold">₹{application.amount.toLocaleString("en-IN")}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">PAN Used</span>
                    <span className="text-sm font-mono">{application.panUsed}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Applied From</span>
                    <Badge variant="secondary">
                      {application.appliedFrom === "own" ? "Own Account" : `Friend: ${application.friendName}`}
                    </Badge>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <AddApplicationDialog open={addDialogOpen} onOpenChange={setAddDialogOpen} />
    </div>
  )
}
