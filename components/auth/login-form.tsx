"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/lib/auth"
import { Loader2 } from "lucide-react"

export function LoginForm() {
  const [isSignup, setIsSignup] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const { login, signup, isLoading } = useAuth()

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!email || !password) {
      setError("Email and password are required")
      return
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email address")
      return
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters")
      return
    }

    try {
      const result = isSignup ? await signup(email, password) : await login(email, password)

      if (!result.success) {
        setError(result.error || "An error occurred")
      }
    } catch (err) {
      setError("Failed to authenticate. Please try again.")
    }
  }

  return (
    <div className="w-full max-w-sm animate-scale-in">
      <div className="mb-8 text-center">
        <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-foreground mb-4">
          <span className="text-background font-bold text-2xl">IPO</span>
        </div>
        <h1 className="text-4xl font-semibold tracking-tight text-balance mb-2">
          {isSignup ? "Create Account" : "Welcome Back"}
        </h1>
        <p className="text-muted-foreground text-pretty">
          {isSignup ? "Sign up to start tracking IPO applications" : "Sign in to access your dashboard"}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-medium">
            Email Address
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading}
            className="h-12 text-base"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password" className="text-sm font-medium">
            Password
          </Label>
          <Input
            id="password"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isLoading}
            className="h-12 text-base"
            required
          />
        </div>

        {error && <p className="text-sm text-red-600 dark:text-red-400 animate-fade-in">{error}</p>}

        <Button type="submit" className="w-full h-12 text-base font-medium" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {isSignup ? "Creating account..." : "Signing in..."}
            </>
          ) : isSignup ? (
            "Sign up"
          ) : (
            "Sign in"
          )}
        </Button>
      </form>

      <div className="mt-6 text-center">
        <button
          type="button"
          onClick={() => {
            setIsSignup(!isSignup)
            setError("")
          }}
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          {isSignup ? "Already have an account? Sign in" : "Don't have an account? Sign up"}
        </button>
      </div>

      <p className="mt-6 text-xs text-center text-muted-foreground">
        Your data is securely stored and never shared with third parties
      </p>
    </div>
  )
}
