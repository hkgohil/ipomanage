"use client"

import type { IPO } from "@/lib/ipo-store"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Calendar,
  TrendingUp,
  Users,
  Banknote,
  ExternalLink,
  CheckCircle2,
  XCircle,
  MinusCircle,
  Edit,
  Trash2,
} from "lucide-react"
import { format, isAfter, isBefore } from "date-fns"
import { useAuth } from "@/lib/auth"
import { useIPOStore } from "@/lib/ipo-store"
import { useState } from "react"
import { EditIPODialog } from "./edit-ipo-dialog"
import { useToast } from "@/hooks/use-toast"

interface IPOCardProps {
  ipo: IPO
}

export function IPOCard({ ipo }: IPOCardProps) {
  const { user } = useAuth()
  const { deleteIPO } = useIPOStore()
  const { toast } = useToast()
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const isAdmin = user?.role === "admin"

  const today = new Date()
  const openDate = new Date(ipo.openDate)
  const closeDate = new Date(ipo.closeDate)

  const getStatusBadge = () => {
    if (ipo.status === "allotment-out") {
      return <Badge className="bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20">Allotment Out</Badge>
    }
    if (ipo.status === "open") {
      return <Badge className="bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20">Open</Badge>
    }
    if (ipo.status === "closed") {
      return (
        <Badge variant="secondary" className="border">
          Closed
        </Badge>
      )
    }

    // Fallback to date-based status
    const isOpen = isAfter(today, openDate) && isBefore(today, closeDate)
    const isClosed = isAfter(today, closeDate)

    if (isOpen)
      return <Badge className="bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20">Open</Badge>
    if (isClosed)
      return (
        <Badge variant="secondary" className="border">
          Closed
        </Badge>
      )
    return (
      <Badge variant="outline" className="border-dashed">
        Upcoming
      </Badge>
    )
  }

  const getRecommendationIcon = () => {
    switch (ipo.recommendation) {
      case "apply":
        return <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
      case "avoid":
        return <XCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
      default:
        return <MinusCircle className="h-4 w-4 text-muted-foreground" />
    }
  }

  const getRecommendationText = () => {
    switch (ipo.recommendation) {
      case "apply":
        return "Recommended to Apply"
      case "avoid":
        return "Avoid"
      default:
        return "Neutral"
    }
  }

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete ${ipo.name}?`)) {
      deleteIPO(ipo.id)
      toast({
        title: "IPO Deleted",
        description: `${ipo.name} has been removed`,
      })
    }
  }

  return (
    <>
      <Card className="hover:shadow-lg transition-shadow duration-200 group">
        <CardHeader className="space-y-3">
          <div className="flex items-start justify-between">
            <h3 className="font-semibold text-lg leading-tight text-balance group-hover:text-primary transition-colors flex-1 pr-2">
              {ipo.name}
            </h3>
            <div className="flex items-center gap-2">
              {getStatusBadge()}
              {isAdmin && (
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setEditDialogOpen(true)}>
                    <Edit className="h-3.5 w-3.5" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-7 w-7" onClick={handleDelete}>
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 text-sm">
            {getRecommendationIcon()}
            <span
              className={
                ipo.recommendation === "apply"
                  ? "text-green-600 dark:text-green-400 font-medium"
                  : ipo.recommendation === "avoid"
                    ? "text-red-600 dark:text-red-400 font-medium"
                    : "text-muted-foreground"
              }
            >
              {getRecommendationText()}
            </span>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="h-3.5 w-3.5" />
                <span>Open Date</span>
              </div>
              <p className="font-medium">{format(openDate, "dd MMM yyyy")}</p>
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="h-3.5 w-3.5" />
                <span>Close Date</span>
              </div>
              <p className="font-medium">{format(closeDate, "dd MMM yyyy")}</p>
            </div>
          </div>

          <div className="space-y-3 pt-2 border-t border-border/50">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Banknote className="h-3.5 w-3.5" />
                <span>Issue Size</span>
              </div>
              <span className="font-medium">{ipo.issueSize}</span>
            </div>

            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Users className="h-3.5 w-3.5" />
                <span>Retail Portion</span>
              </div>
              <span className="font-medium">{ipo.retailPortion}</span>
            </div>

            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <TrendingUp className="h-3.5 w-3.5" />
                <span>Grey Market Premium</span>
              </div>
              <span
                className={`font-semibold ${
                  ipo.greyMarketPremium > 0
                    ? "text-green-600 dark:text-green-400"
                    : ipo.greyMarketPremium < 0
                      ? "text-red-600 dark:text-red-400"
                      : ""
                }`}
              >
                {ipo.greyMarketPremium > 0 ? "+" : ""}
                {ipo.greyMarketPremium}%
              </span>
            </div>
          </div>
        </CardContent>

        <CardFooter>
          <Button variant="outline" className="w-full group/btn bg-transparent" asChild>
            <a href={ipo.allotmentLink} target="_blank" rel="noopener noreferrer">
              Check Allotment Status
              <ExternalLink className="ml-2 h-3.5 w-3.5 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
            </a>
          </Button>
        </CardFooter>
      </Card>

      {isAdmin && <EditIPODialog open={editDialogOpen} onOpenChange={setEditDialogOpen} ipo={ipo} />}
    </>
  )
}
