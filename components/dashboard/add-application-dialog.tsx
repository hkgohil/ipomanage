"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/lib/auth"
import { useApplicationStore } from "@/lib/application-store"
import { useIPOStore } from "@/lib/ipo-store"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useToast } from "@/hooks/use-toast"

interface AddApplicationDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AddApplicationDialog({ open, onOpenChange }: AddApplicationDialogProps) {
  const { user } = useAuth()
  const { addApplication } = useApplicationStore()
  const { ipos } = useIPOStore()
  const { toast } = useToast()

  const [ipoId, setIpoId] = useState("")
  const [amount, setAmount] = useState("")
  const [panUsed, setPanUsed] = useState("")
  const [appliedFrom, setAppliedFrom] = useState<"own" | "friend">("own")
  const [friendName, setFriendName] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!user || !ipoId || !amount || !panUsed) {
      toast({
        title: "Error",
        description: "Please fill all required fields",
        variant: "destructive",
      })
      return
    }

    if (appliedFrom === "friend" && !friendName) {
      toast({
        title: "Error",
        description: "Please enter friend/family name",
        variant: "destructive",
      })
      return
    }

    const selectedIPO = ipos.find((ipo) => ipo.id === ipoId)
    if (!selectedIPO) return

    addApplication({
      userId: user.id,
      ipoId,
      ipoName: selectedIPO.name,
      amount: Number.parseFloat(amount),
      panUsed,
      appliedFrom,
      friendName: appliedFrom === "friend" ? friendName : undefined,
      appliedDate: new Date().toISOString(),
    })

    toast({
      title: "Application added",
      description: "Your IPO application has been tracked successfully",
    })

    // Reset form
    setIpoId("")
    setAmount("")
    setPanUsed("")
    setAppliedFrom("own")
    setFriendName("")
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add IPO Application</DialogTitle>
          <DialogDescription>Track your personal IPO investment</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="ipo">IPO Name</Label>
            <Select value={ipoId} onValueChange={setIpoId}>
              <SelectTrigger>
                <SelectValue placeholder="Select IPO" />
              </SelectTrigger>
              <SelectContent>
                {ipos.map((ipo) => (
                  <SelectItem key={ipo.id} value={ipo.id}>
                    {ipo.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">Amount Invested (₹)</Label>
            <Input
              id="amount"
              type="number"
              placeholder="15000"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="pan">PAN Used</Label>
            {user?.panCards && user.panCards.length > 0 ? (
              <Select value={panUsed} onValueChange={setPanUsed}>
                <SelectTrigger>
                  <SelectValue placeholder="Select PAN" />
                </SelectTrigger>
                <SelectContent>
                  {user.panCards.map((panCard) => {
                    const pan = typeof panCard === "string" ? panCard : panCard.pan
                    const name = typeof panCard === "string" ? "" : (panCard.name || "")
                    return (
                      <SelectItem key={pan} value={pan}>
                        <div className="flex flex-col">
                          <span className="font-mono">{pan}</span>
                          {name && <span className="text-xs text-muted-foreground">{name}</span>}
                        </div>
                      </SelectItem>
                    )
                  })}
                </SelectContent>
              </Select>
            ) : (
              <Input
                id="pan"
                placeholder="ABCDE1234F"
                value={panUsed}
                onChange={(e) => setPanUsed(e.target.value.toUpperCase())}
                maxLength={10}
                required
              />
            )}
          </div>

          <div className="space-y-3">
            <Label>Applied From</Label>
            <RadioGroup value={appliedFrom} onValueChange={(value) => setAppliedFrom(value as "own" | "friend")}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="own" id="own" />
                <Label htmlFor="own" className="font-normal cursor-pointer">
                  Own Account
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="friend" id="friend" />
                <Label htmlFor="friend" className="font-normal cursor-pointer">
                  Friend / Family Account
                </Label>
              </div>
            </RadioGroup>
          </div>

          {appliedFrom === "friend" && (
            <div className="space-y-2">
              <Label htmlFor="friendName">Friend / Family Name</Label>
              <Input
                id="friendName"
                placeholder="Enter name"
                value={friendName}
                onChange={(e) => setFriendName(e.target.value)}
                required
              />
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" className="flex-1">
              Add Application
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
