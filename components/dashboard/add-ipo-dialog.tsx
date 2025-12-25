"use client"

import type React from "react"

import { useState } from "react"
import { useIPOStore } from "@/lib/ipo-store"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"

interface AddIPODialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AddIPODialog({ open, onOpenChange }: AddIPODialogProps) {
  const { addIPO } = useIPOStore()
  const { user } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  
  const isAdmin = user?.role === "admin"
  
  if (!isAdmin) {
    return null
  }

  const [formData, setFormData] = useState({
    name: "",
    openDate: "",
    closeDate: "",
    issueSize: "",
    retailPortion: "",
    greyMarketPremium: "",
    recommendation: "neutral" as "apply" | "avoid" | "neutral",
    allotmentLink: "",
    allotmentDate: "",
    status: "open" as "open" | "closed" | "allotment-out", // Add status field
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    await new Promise((resolve) => setTimeout(resolve, 500))

    addIPO({
      ...formData,
      greyMarketPremium: Number.parseFloat(formData.greyMarketPremium) || 0,
    })

    setIsLoading(false)
    onOpenChange(false)

    toast({
      title: "IPO Added",
      description: `${formData.name} has been added successfully.`,
    })

    // Reset form
    setFormData({
      name: "",
      openDate: "",
      closeDate: "",
      issueSize: "",
      retailPortion: "",
      greyMarketPremium: "",
      recommendation: "neutral",
      allotmentLink: "",
      allotmentDate: "",
      status: "open",
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New IPO</DialogTitle>
          <DialogDescription>Add a mainboard IPO to track applications and allotments</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="name">IPO Name *</Label>
              <Input
                id="name"
                placeholder="e.g., Acme Corporation Ltd"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="openDate">Open Date *</Label>
              <Input
                id="openDate"
                type="date"
                value={formData.openDate}
                onChange={(e) => setFormData({ ...formData, openDate: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="closeDate">Close Date *</Label>
              <Input
                id="closeDate"
                type="date"
                value={formData.closeDate}
                onChange={(e) => setFormData({ ...formData, closeDate: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status *</Label>
              <Select
                value={formData.status}
                onValueChange={(value: "open" | "closed" | "allotment-out") =>
                  setFormData({ ...formData, status: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="open">Open</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                  <SelectItem value="allotment-out">Allotment Out</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="issueSize">Issue Size *</Label>
              <Input
                id="issueSize"
                placeholder="e.g., ₹500 Cr"
                value={formData.issueSize}
                onChange={(e) => setFormData({ ...formData, issueSize: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="retailPortion">Retail Portion *</Label>
              <Input
                id="retailPortion"
                placeholder="e.g., 35%"
                value={formData.retailPortion}
                onChange={(e) => setFormData({ ...formData, retailPortion: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="greyMarketPremium">Grey Market Premium (%) *</Label>
              <Input
                id="greyMarketPremium"
                type="number"
                step="0.01"
                placeholder="e.g., 15.5"
                value={formData.greyMarketPremium}
                onChange={(e) => setFormData({ ...formData, greyMarketPremium: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="recommendation">Recommendation *</Label>
              <Select
                value={formData.recommendation}
                onValueChange={(value: "apply" | "avoid" | "neutral") =>
                  setFormData({ ...formData, recommendation: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="apply">Apply</SelectItem>
                  <SelectItem value="neutral">Neutral</SelectItem>
                  <SelectItem value="avoid">Avoid</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="allotmentLink">Allotment Check Link *</Label>
              <Input
                id="allotmentLink"
                type="url"
                placeholder="https://..."
                value={formData.allotmentLink}
                onChange={(e) => setFormData({ ...formData, allotmentLink: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="allotmentDate">Allotment Date (Optional)</Label>
              <Input
                id="allotmentDate"
                type="date"
                value={formData.allotmentDate}
                onChange={(e) => setFormData({ ...formData, allotmentDate: e.target.value })}
              />
            </div>
          </div>

          <div className="flex gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" className="flex-1" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Adding...
                </>
              ) : (
                "Add IPO"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
