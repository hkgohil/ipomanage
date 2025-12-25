"use client"

import { useState } from "react"
import { useAuth } from "@/lib/auth"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CreditCard, Plus, Shield, Trash2 } from "lucide-react"
import { PanCardDialog } from "./pan-card-dialog"
import { useToast } from "@/hooks/use-toast"

export function PanSection() {
  const { user, removePanCard } = useAuth()
  const [panDialogOpen, setPanDialogOpen] = useState(false)
  const { toast } = useToast()

  const handleRemovePAN = async (pan: string) => {
    removePanCard(pan)
    toast({
      title: "PAN Card Removed",
      description: "PAN card has been removed from your account",
    })
  }

  return (
    <>
      <Card className="p-6 animate-fade-in">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              PAN Cards
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              Manage your PAN cards for IPO allotment checking
            </p>
          </div>
          <Button onClick={() => setPanDialogOpen(true)} size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add PAN
          </Button>
        </div>

        {user?.panCards && user.panCards.length > 0 ? (
          <div className="space-y-2">
            {user.panCards.map((panCard) => {
              const pan = typeof panCard === "string" ? panCard : panCard.pan
              const name = typeof panCard === "string" ? "Unknown" : (panCard.name || "Unknown")
              return (
                <div
                  key={pan}
                  className="flex items-center justify-between p-3 rounded-lg border border-border/50 bg-muted/30 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="h-8 w-8 rounded-md bg-primary/10 flex items-center justify-center shrink-0">
                      <Shield className="h-4 w-4 text-primary" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="font-mono text-sm font-medium">{pan}</div>
                      <p className="text-xs text-muted-foreground mt-0.5 truncate">{name}</p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 shrink-0"
                    onClick={() => handleRemovePAN(pan)}
                  >
                    <Trash2 className="h-4 w-4 text-muted-foreground hover:text-red-600" />
                  </Button>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
              <CreditCard className="h-8 w-8 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              No PAN cards added yet. Add your first PAN card to get started.
            </p>
            <Button onClick={() => setPanDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Your First PAN Card
            </Button>
          </div>
        )}

        <div className="mt-4 p-3 bg-muted/50 border border-border/50 rounded-lg">
          <div className="flex items-start gap-2 text-xs text-muted-foreground">
            <Shield className="h-3.5 w-3.5 mt-0.5 shrink-0" />
            <p>Your PAN data is encrypted and stored securely. It's only used for checking allotment status.</p>
          </div>
        </div>
      </Card>

      <PanCardDialog open={panDialogOpen} onOpenChange={setPanDialogOpen} />
    </>
  )
}
