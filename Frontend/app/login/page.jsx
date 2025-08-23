"use client";

import { useState } from "react";
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

function LoginContent() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [errorHandler, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault(); // prevent form default submission
    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/login",
        {
          email,
          password,
        }
      );

      // axios automatically returns data
      const data = response.data;

      if (response.status === 200) {
        router.push("/");
      } else {
        setError(data.message || "Invalid login credentials");
      }
    } catch (err) {
      // Handle errors (network errors or server errors)
      const message =
        err.response?.data?.message || err.message || "Something went wrong";
      console.log(message);

      setError(message);
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
            <CardTitle>Welcome back</CardTitle>
            <CardDescription>
              Login to start creating and managing your posts.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form className="grid gap-4" onSubmit={handleSubmit}>
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
                Continue
              </Button>
              {errorHandler && (
                <p className="text-xs text-red-600">{errorHandler}</p>
              )}
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return <LoginContent />;
}
