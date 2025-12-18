"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"

export interface IPOApplication {
  id: string
  userId: string
  ipoId: string
  ipoName: string
  amount: number
  panUsed: string
  appliedFrom: "own" | "friend"
  friendName?: string
  appliedDate: string
}

interface ApplicationState {
  applications: IPOApplication[]
  addApplication: (application: Omit<IPOApplication, "id">) => void
  deleteApplication: (id: string) => void
  getApplicationsByUser: (userId: string) => IPOApplication[]
}

export const useApplicationStore = create<ApplicationState>()(
  persist(
    (set, get) => ({
      applications: [],
      addApplication: (application) => {
        const newApplication: IPOApplication = {
          ...application,
          id: Date.now().toString(),
        }
        set((state) => ({ applications: [...state.applications, newApplication] }))
      },
      deleteApplication: (id) => {
        set((state) => ({
          applications: state.applications.filter((app) => app.id !== id),
        }))
      },
      getApplicationsByUser: (userId: string) => {
        return get().applications.filter((app) => app.userId === userId)
      },
    }),
    {
      name: "application-storage",
    },
  ),
)
