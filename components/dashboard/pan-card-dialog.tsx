"use client"

import type React from "react"
import { useState } from "react"
import { useAuth } from "@/lib/auth"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, Shield, Plus, Trash2, CreditCard } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface PanCardDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function PanCardDialog({ open, onOpenChange }: PanCardDialogProps) {
  const { user, addPanCard, removePanCard } = useAuth()
  const [panCard, setPanCard] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const { toast } = useToast()

  const validatePAN = (pan: string) => {
    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/
    return panRegex.test(pan)
  }

  const handleAddPAN = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    const panUpper = panCard.toUpperCase().trim()

    if (!validatePAN(panUpper)) {
      setError("Invalid PAN format. Expected format: ABCDE1234F")
      return
    }

    // Check if PAN already exists
    if (user?.panCards.includes(panUpper)) {
      setError("This PAN card is already added")
      return
    }

    setIsLoading(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500))

    addPanCard(panUpper)
    setIsLoading(false)
    setPanCard("")

    toast({
      title: "PAN Card Added",
      description: "Your PAN card has been securely saved",
    })
  }

  const handleRemovePAN = async (pan: string) => {
    removePanCard(pan)
    toast({
      title: "PAN Card Removed",
      description: "PAN card has been removed from your account",
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Manage PAN Cards
          </DialogTitle>
          <DialogDescription>
            Add multiple PAN cards for checking allotment status. Your data is encrypted and secure.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {user?.panCards && user.panCards.length > 0 && (
            <div className="space-y-2">
              <Label className="text-sm font-medium">Your PAN Cards</Label>
              <div className="space-y-2">
                {user.panCards.map((pan) => (
                  <div
                    key={pan}
                    className="flex items-center justify-between p-3 rounded-lg border border-border/50 bg-muted/30"
                  >
                    <div className="flex items-center gap-2">
                      <CreditCard className="h-4 w-4 text-muted-foreground" />
                      <span className="font-mono text-sm">{pan}</span>
                    </div>
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleRemovePAN(pan)}>
                      <Trash2 className="h-4 w-4 text-muted-foreground hover:text-red-600" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <form onSubmit={handleAddPAN} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="pan">Add New PAN Card</Label>
              <Input
                id="pan"
                placeholder="ABCDE1234F"
                value={panCard}
                onChange={(e) => setPanCard(e.target.value.toUpperCase())}
                disabled={isLoading}
                maxLength={10}
                className="font-mono tracking-wider"
              />
              <p className="text-xs text-muted-foreground">Format: 5 letters, 4 numbers, 1 letter</p>
            </div>

            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg animate-fade-in">
                <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
              </div>
            )}

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Adding...
                </>
              ) : (
                <>
                  <Plus className="mr-2 h-4 w-4" />
                  Add PAN Card
                </>
              )}
            </Button>
          </form>

          <div className="p-3 bg-muted/50 border border-border/50 rounded-lg">
            <div className="flex items-start gap-2 text-xs text-muted-foreground">
              <Shield className="h-3.5 w-3.5 mt-0.5 flex-shrink-0" />
              <p>Your PAN data is stored securely and only used for checking allotment status.</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
