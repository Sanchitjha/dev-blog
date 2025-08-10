"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { AuthProvider, useAuth } from "@/components/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import ParticleBackground from "@/components/particle-background"
import Link from "next/link"

function LoginContent() {
  const router = useRouter()
  const { login } = useAuth()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")

  const canSubmit = name.trim().length >= 2 && /\S+@\S+\.\S+/.test(email)

  function handleSubmit(e) {
    e.preventDefault()
    if (!canSubmit) return
    login({ name: name.trim(), email: email.trim().toLowerCase() })
    router.push("/")
  }

  return (
    <div className="relative min-h-screen">
      <ParticleBackground className="opacity-90" />

      <div className="absolute left-0 top-0 p-4">
        <Button asChild variant="ghost">
          <Link href="/">← Back</Link>
        </Button>
      </div>

      <div className="flex min-h-screen items-center justify-center px-4">
        <Card className="w-full max-w-md backdrop-blur bg-white/90">
          <CardHeader>
            <CardTitle>Welcome back</CardTitle>
            <CardDescription>Login to start creating and managing your posts.</CardDescription>
          </CardHeader>
          <CardContent>
            <form className="grid gap-4" onSubmit={handleSubmit}>
              <div className="grid gap-2">
                <label htmlFor="name" className="text-sm font-medium">
                  Name
                </label>
                <Input
                  id="name"
                  placeholder="Jane Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className="grid gap-2">
                <label htmlFor="email" className="text-sm font-medium">
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="jane@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" disabled={!canSubmit} className="bg-emerald-600 hover:bg-emerald-700">
                Continue
              </Button>
              <p className="text-xs text-muted-foreground">
                Note: This demo uses localStorage to simulate login. For production, use a proper auth provider.
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <AuthProvider>
      <LoginContent />
    </AuthProvider>
  )
}
