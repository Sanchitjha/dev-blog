"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import ParticleBackground from "@/components/particle-background";
import Link from "next/link";
import axios from "axios";
import Loading from "@/components/loading";

function AuthContent() {
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState(""); // only for signup
  const [errorHandler, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const toggleMode = () => {
    setMode(mode === "login" ? "signup" : "login");
    setError("");
  };

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true); // start loading
    setError(""); // reset error

    try {
      const endpoint =
        mode === "login"
          ? "http://localhost:5000/api/auth/login"
          : "http://localhost:5000/api/auth/register";

      const payload =
        mode === "login" ? { email, password } : { name, email, password };

      const response = await axios.post(endpoint, payload);

      const data = response.data;

      if (response.status === 200) {
        if (mode === "login") {
          localStorage.setItem("token", data.token);
        }
        router.push("/");
      } else {
        setError(data.message || "Something went wrong");
      }
    } catch (err) {
      const message =
        err.response?.data?.message || err.message || "Something went wrong";
      setError(message);
      console.log(message);
    } finally {
      setLoading(false); // stop loading
    }
  }

  return (
    <div className="relative min-h-screen">
      <ParticleBackground className="opacity-90" />

      <div className="absolute left-0 top-0 p-4">
        <Button asChild variant="secondary">
          <Link href="/">← Back</Link>
        </Button>
      </div>

      <div className="flex min-h-screen items-center justify-center px-4">
        <Card className="w-full max-w-md backdrop-blur bg-white/90">
          <CardHeader>
            <CardTitle>
              {mode === "login" ? "Welcome back" : "Create an account"}
            </CardTitle>
            <CardDescription>
              {mode === "login"
                ? "Login to start creating and managing your posts."
                : "Sign up to start creating and managing your posts."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form className="grid gap-4" onSubmit={handleSubmit}>
              {mode === "signup" && (
                <div className="grid gap-2">
                  <label htmlFor="name" className="text-sm font-medium">
                    Name
                  </label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Jane Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
              )}

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

              <div className="grid gap-2">
                <label htmlFor="password" className="text-sm font-medium">
                  Password
                </label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <Button
                type="submit"
                className="bg-emerald-600 hover:bg-emerald-700"
              >
                {loading
                  ? "Loading..."
                  : mode === "login"
                  ? "Login"
                  : "Sign Up"}
              </Button>

              {errorHandler && (
                <p className="text-xs text-red-600">{errorHandler}</p>
              )}

              <p className="text-center text-sm text-gray-600">
                {mode === "login"
                  ? "Don't have an account?"
                  : "Already have an account?"}{" "}
                <button
                  type="button"
                  className="text-emerald-600 font-medium underline"
                  onClick={toggleMode}
                >
                  {mode === "login" ? "Sign Up" : "Login"}
                </button>
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return <AuthContent />;
}
