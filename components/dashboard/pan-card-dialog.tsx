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
  const [panName, setPanName] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isFetchingName, setIsFetchingName] = useState(false)
  const [error, setError] = useState("")
  const { toast } = useToast()

  const validatePAN = (pan: string) => {
    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/
    return panRegex.test(pan)
  }

  const fetchPANName = async (pan: string) => {
    if (!validatePAN(pan)) return
    
    setIsFetchingName(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 800))
      
      const response = await fetch(`/api/pan/verify?pan=${pan}`)
      if (response.ok) {
        const data = await response.json()
        if (data.name) {
          setPanName(data.name)
          toast({
            title: "Name fetched",
            description: "PAN card holder name retrieved successfully",
          })
        }
      }
    } catch (error) {
      console.error("Error fetching PAN name:", error)
    } finally {
      setIsFetchingName(false)
    }
  }

  const handlePANChange = (value: string) => {
    const panUpper = value.toUpperCase().trim()
    setPanCard(panUpper)
    
    if (validatePAN(panUpper) && panUpper.length === 10) {
      fetchPANName(panUpper)
    } else {
      setPanName("")
    }
  }

  const handleAddPAN = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    const panUpper = panCard.toUpperCase().trim()

    if (!validatePAN(panUpper)) {
      setError("Invalid PAN format. Expected format: ABCDE1234F")
      return
    }

    if (!panName.trim()) {
      setError("Please enter the PAN card holder name")
      return
    }

    // Check if PAN already exists
    const panExists = user?.panCards.some((p) => 
      typeof p === "string" ? p === panUpper : p.pan === panUpper
    )
    
    if (panExists) {
      setError("This PAN card is already added")
      return
    }

    setIsLoading(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500))

    addPanCard({ pan: panUpper, name: panName.trim() })
    setIsLoading(false)
    setPanCard("")
    setPanName("")

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
  
  const getPanDisplay = (panCard: any) => {
    if (typeof panCard === "string") return panCard
    return panCard.pan
  }
  
  const getPanName = (panCard: any) => {
    if (typeof panCard === "string") return "Unknown"
    return panCard.name || "Unknown"
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
                {user.panCards.map((panCard, index) => {
                  const pan = getPanDisplay(panCard)
                  const name = getPanName(panCard)
                  return (
                    <div
                      key={typeof panCard === "string" ? pan : pan}
                      className="flex items-center justify-between p-3 rounded-lg border border-border/50 bg-muted/30"
                    >
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <CreditCard className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                        <div className="min-w-0 flex-1">
                          <div className="font-mono text-sm font-medium">{pan}</div>
                          <div className="text-xs text-muted-foreground truncate">{name}</div>
                        </div>
                      </div>
                      <Button variant="ghost" size="icon" className="h-8 w-8 flex-shrink-0" onClick={() => handleRemovePAN(pan)}>
                        <Trash2 className="h-4 w-4 text-muted-foreground hover:text-red-600" />
                      </Button>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          <form onSubmit={handleAddPAN} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="pan">PAN Card Number</Label>
              <div className="relative">
                <Input
                  id="pan"
                  placeholder="ABCDE1234F"
                  value={panCard}
                  onChange={(e) => handlePANChange(e.target.value)}
                  disabled={isLoading || isFetchingName}
                  maxLength={10}
                  className="font-mono tracking-wider pr-10"
                />
                {isFetchingName && (
                  <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-muted-foreground" />
                )}
              </div>
              <p className="text-xs text-muted-foreground">Format: 5 letters, 4 numbers, 1 letter</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="panName">PAN Card Holder Name</Label>
              <Input
                id="panName"
                placeholder="Enter card holder name"
                value={panName}
                onChange={(e) => setPanName(e.target.value)}
                disabled={isLoading}
                className="capitalize"
              />
              <p className="text-xs text-muted-foreground">
                {panCard && validatePAN(panCard) 
                  ? "Name will be auto-fetched if available, or enter manually"
                  : "Enter the name as it appears on the PAN card"}
              </p>
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
