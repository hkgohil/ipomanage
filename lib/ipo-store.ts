"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"

export interface IPO {
  id: string
  name: string
  openDate: string
  closeDate: string
  issueSize: string
  retailPortion: string
  greyMarketPremium: number
  recommendation: "apply" | "avoid" | "neutral"
  allotmentLink: string
  allotmentDate?: string
  status: "open" | "closed" | "allotment-out"
}

interface IPOState {
  ipos: IPO[]
  addIPO: (ipo: Omit<IPO, "id">) => void
  updateIPO: (id: string, ipo: Partial<IPO>) => void
  deleteIPO: (id: string) => void
}

export const useIPOStore = create<IPOState>()(
  persist(
    (set) => ({
      ipos: [],
      addIPO: (ipo) => {
        const newIPO: IPO = {
          ...ipo,
          id: Date.now().toString(),
        }
        set((state) => ({ ipos: [newIPO, ...state.ipos] }))
      },
      updateIPO: (id, updatedFields) => {
        set((state) => ({
          ipos: state.ipos.map((ipo) => (ipo.id === id ? { ...ipo, ...updatedFields } : ipo)),
        }))
      },
      deleteIPO: (id) => {
        set((state) => ({
          ipos: state.ipos.filter((ipo) => ipo.id !== id),
        }))
      },
    }),
    {
      name: "ipo-storage",
    },
  ),
)
