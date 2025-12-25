"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"

export interface PanCard {
  pan: string
  name: string
}

export interface User {
  id: string
  email: string
  password: string
  role: "admin" | "user"
  panCards: PanCard[]
  createdAt: string
}

interface AuthState {
  user: User | null
  isLoading: boolean
  signup: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  logout: () => void
  addPanCard: (panCard: PanCard) => void
  removePanCard: (pan: string) => void
}

export const useAuth = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isLoading: false,
      signup: async (email: string, password: string) => {
        set({ isLoading: true })
        await new Promise((resolve) => setTimeout(resolve, 500))

        // Check if user already exists (simulate database check)
        const existingUsers = JSON.parse(localStorage.getItem("all-users") || "[]")
        const userExists = existingUsers.find((u: User) => u.email === email)

        if (userExists) {
          set({ isLoading: false })
          return { success: false, error: "User already exists. Please sign in." }
        }

        // Create new user (first user is admin, rest are users)
        const isFirstUser = existingUsers.length === 0
        const newUser: User = {
          id: Date.now().toString(),
          email,
          password, // In production, this would be hashed
          role: isFirstUser ? "admin" : "user",
          panCards: [],
          createdAt: new Date().toISOString(),
        }

        existingUsers.push(newUser)
        localStorage.setItem("all-users", JSON.stringify(existingUsers))

        set({ user: newUser, isLoading: false })
        return { success: true }
      },
      login: async (email: string, password: string) => {
        set({ isLoading: true })
        await new Promise((resolve) => setTimeout(resolve, 500))

        const existingUsers = JSON.parse(localStorage.getItem("all-users") || "[]")
        const user = existingUsers.find((u: User) => u.email === email && u.password === password)

        if (!user) {
          set({ isLoading: false })
          return { success: false, error: "Invalid email or password" }
        }

        // Migrate old PAN cards (strings) to new format (objects with name)
        if (user.panCards && user.panCards.length > 0) {
          const migratedPanCards = user.panCards.map((pan: any) => {
            if (typeof pan === "string") {
              return { pan, name: "Unknown" }
            }
            return pan
          })
          user.panCards = migratedPanCards
          
          // Update in storage
          const updatedUsers = existingUsers.map((u: User) => 
            u.id === user.id ? { ...u, panCards: migratedPanCards } : u
          )
          localStorage.setItem("all-users", JSON.stringify(updatedUsers))
        }

        set({ user, isLoading: false })
        return { success: true }
      },
      logout: () => {
        set({ user: null })
      },
      addPanCard: (panCard: PanCard) => {
        set((state) => {
          if (!state.user) return state
          const updatedUser = {
            ...state.user,
            panCards: [...state.user.panCards, panCard],
          }
          // Update in all-users storage
          const allUsers = JSON.parse(localStorage.getItem("all-users") || "[]")
          const updatedUsers = allUsers.map((u: User) => (u.id === updatedUser.id ? updatedUser : u))
          localStorage.setItem("all-users", JSON.stringify(updatedUsers))
          return { user: updatedUser }
        })
      },
      removePanCard: (pan: string) => {
        set((state) => {
          if (!state.user) return state
          const updatedUser = {
            ...state.user,
            panCards: state.user.panCards.filter((p) => p.pan !== pan),
          }
          // Update in all-users storage
          const allUsers = JSON.parse(localStorage.getItem("all-users") || "[]")
          const updatedUsers = allUsers.map((u: User) => (u.id === updatedUser.id ? updatedUser : u))
          localStorage.setItem("all-users", JSON.stringify(updatedUsers))
          return { user: updatedUser }
        })
      },
    }),
    {
      name: "auth-storage",
    },
  ),
)
