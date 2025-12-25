"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  TrendingUp,
  CreditCard,
  FileText,
  Search,
  Home,
} from "lucide-react"
import { useAuth } from "@/lib/auth"

const navigationItems = [
  {
    title: "Home",
    href: "/",
    icon: Home,
    adminOnly: false,
  },
  {
    title: "IPOs",
    href: "/ipos",
    icon: TrendingUp,
    adminOnly: false,
  },
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    adminOnly: false,
  },
  {
    title: "PAN Cards",
    href: "/pan",
    icon: CreditCard,
    adminOnly: false,
  },
  {
    title: "Applications",
    href: "/applications",
    icon: FileText,
    adminOnly: false,
  },
  {
    title: "Allotment",
    href: "/allotment",
    icon: Search,
    adminOnly: false,
  },
]

export function Navigation() {
  const pathname = usePathname()
  const { user } = useAuth()
  const isAdmin = user?.role === "admin"

  const filteredItems = navigationItems.filter((item) => {
    if (item.adminOnly && !isAdmin) return false
    if (!item.adminOnly || isAdmin) return true
    return true
  })

  return (
    <nav className="sticky top-16 z-40 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-1 overflow-x-auto scrollbar-hide">
          {filteredItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href || (item.href !== "/" && pathname?.startsWith(item.href))
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "relative flex items-center gap-2 px-4 py-3 text-sm font-medium transition-all duration-300",
                  "hover:text-foreground hover:bg-muted/50",
                  isActive
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground/80",
                  "group rounded-md"
                )}
              >
                <Icon className={cn(
                  "h-4 w-4 transition-all duration-300",
                  isActive && "scale-110 text-primary",
                  "group-hover:scale-110"
                )} />
                <span className="whitespace-nowrap">{item.title}</span>
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary animate-slide-in-from-left" />
                )}
                <span className={cn(
                  "absolute inset-0 rounded-md bg-primary/5 opacity-0 transition-opacity duration-300",
                  isActive && "opacity-100"
                )} />
              </Link>
            )
          })}
        </div>
      </div>
    </nav>
  )
}
