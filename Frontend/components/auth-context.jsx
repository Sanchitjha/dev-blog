"use client"

import { createContext, useContext, useEffect, useMemo, useState } from "react"

const AuthContext = createContext(null)
const STORAGE_KEY = "blog_user"

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) setUser(JSON.parse(raw))
    } catch {}
    setReady(true)
  }, [])

  const login = (payload) => {
    // Accept name and email from login form, other fields optional
    const next = {
      name: payload?.name || "User",
      email: payload?.email || "",
      phone: payload?.phone || "",
      image: payload?.image || "",
    }
    setUser(next)
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
    } catch {}
  }

  const updateUser = (partial) => {
    setUser((prev) => {
      const merged = { ...(prev || {}), ...(partial || {}) }
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(merged))
      } catch {}
      return merged
    })
  }

  const logout = () => {
    setUser(null)
    try {
      localStorage.removeItem(STORAGE_KEY)
    } catch {}
  }

  const value = useMemo(() => ({ user, ready, login, logout, updateUser }), [user, ready])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error("useAuth must be used within <AuthProvider>")
  }
  return ctx
}
