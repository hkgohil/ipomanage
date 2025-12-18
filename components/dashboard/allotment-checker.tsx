"use client"

import { useState } from "react"
import { useAuth } from "@/lib/auth"
import { useIPOStore } from "@/lib/ipo-store"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, ExternalLink, AlertCircle, CheckCircle2, XCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export function AllotmentChecker() {
  const { user } = useAuth()
  const { ipos } = useIPOStore()
  const { toast } = useToast()
  const [selectedIPO, setSelectedIPO] = useState("")
  const [selectedPAN, setSelectedPAN] = useState("")
  const [checking, setChecking] = useState(false)

  const eligibleIPOs = ipos.filter((ipo) => ipo.status === "allotment-out" || ipo.status === "closed")

  const handleCheck = async () => {
    if (!selectedIPO || !selectedPAN) {
      toast({
        title: "Missing Information",
        description: "Please select both IPO and PAN card",
        variant: "destructive",
      })
      return
    }

    setChecking(true)

    const ipo = ipos.find((i) => i.id === selectedIPO)

    // Simulate allotment check API call
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Random result for demo
    const isAllotted = Math.random() > 0.5
    const sharesAllotted = isAllotted ? Math.floor(Math.random() * 100) + 10 : 0

    setChecking(false)

    if (isAllotted) {
      toast({
        title: "Congratulations!",
        description: (
          <div className="space-y-1">
            <p className="font-semibold flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              Shares Allotted
            </p>
            <p className="text-sm">
              {ipo?.name}: {sharesAllotted} shares
            </p>
            <p className="text-xs text-muted-foreground">PAN: {selectedPAN}</p>
          </div>
        ),
      })
    } else {
      toast({
        title: "Not Allotted",
        description: (
          <div className="space-y-1">
            <p className="font-semibold flex items-center gap-2">
              <XCircle className="h-4 w-4 text-muted-foreground" />
              No shares allotted
            </p>
            <p className="text-sm">{ipo?.name}</p>
            <p className="text-xs text-muted-foreground">PAN: {selectedPAN}</p>
          </div>
        ),
      })
    }
  }

  if (!user) return null

  if (!user.panCards || user.panCards.length === 0) {
    return (
      <Card className="border-dashed">
        <CardContent className="pt-6">
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <AlertCircle className="h-5 w-5" />
            <p>Add your PAN card to enable automatic allotment checking</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Check Allotment Status</CardTitle>
        <CardDescription>Select an IPO and PAN card to check your allotment status automatically</CardDescription>
      </CardHeader>
      <CardContent>
        {eligibleIPOs.length === 0 ? (
          <div className="text-center py-8 text-sm text-muted-foreground">
            No IPOs available for allotment checking yet
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium">Select IPO</label>
                <Select value={selectedIPO} onValueChange={setSelectedIPO}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose IPO" />
                  </SelectTrigger>
                  <SelectContent>
                    {eligibleIPOs.map((ipo) => (
                      <SelectItem key={ipo.id} value={ipo.id}>
                        <div className="flex items-center gap-2">
                          {ipo.name}
                          {ipo.status === "allotment-out" && (
                            <Badge variant="secondary" className="text-xs">
                              Results Out
                            </Badge>
                          )}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Select PAN Card</label>
                <Select value={selectedPAN} onValueChange={setSelectedPAN}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose PAN" />
                  </SelectTrigger>
                  <SelectContent>
                    {user.panCards.map((pan) => (
                      <SelectItem key={pan} value={pan}>
                        {pan}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button onClick={handleCheck} disabled={checking || !selectedIPO || !selectedPAN} className="w-full">
              {checking ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Checking Allotment...
                </>
              ) : (
                "Check Allotment Status"
              )}
            </Button>

            {selectedIPO && (
              <div className="pt-2">
                <Button variant="outline" size="sm" className="w-full bg-transparent" asChild>
                  <a
                    href={eligibleIPOs.find((i) => i.id === selectedIPO)?.allotmentLink}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Or check manually on official website
                    <ExternalLink className="ml-2 h-3.5 w-3.5" />
                  </a>
                </Button>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
