"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { AuthProvider, useAuth } from "@/components/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import ParticleBackground from "@/components/particle-background"
import { useToast } from "@/hooks/use-toast"
import { addPost } from "@/lib/storage"
import Link from "next/link"

function CreatePostContent() {
  const router = useRouter()
  const { toast } = useToast()
  const { user, ready } = useAuth()

  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [tags, setTags] = useState("")

  useEffect(() => {
    if (!ready) return
    if (!user) router.replace("/login")
  }, [ready, user, router])

  const canPost = useMemo(() => {
    return user && title.trim().length > 2 && content.trim().length > 10
  }, [user, title, content])

  function handlePublish(e) {
    e.preventDefault()
    if (!canPost) return
    const tagList = tags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean)
      .slice(0, 5)
    addPost({ title: title.trim(), content: content.trim(), tags: tagList, author: user })
    toast({ title: "Post published", description: "Your post is live." })
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
        <Card className="w-full max-w-2xl backdrop-blur bg-white/90">
          <CardHeader>
            <CardTitle>Create a new post</CardTitle>
            <CardDescription>Compose your thoughts and publish when you are ready.</CardDescription>
          </CardHeader>
          <CardContent>
            <form className="grid gap-4" onSubmit={handlePublish}>
              <div className="grid gap-2">
                <label htmlFor="title" className="text-sm font-medium">
                  Title
                </label>
                <Input
                  id="title"
                  placeholder="A clear, compelling headline"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  maxLength={120}
                  required
                />
              </div>
              <div className="grid gap-2">
                <label htmlFor="content" className="text-sm font-medium">
                  Content
                </label>
                <Textarea
                  id="content"
                  placeholder="Write your story here…"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={8}
                  maxLength={8000}
                  required
                />
              </div>
              <div className="grid gap-2">
                <label htmlFor="tags" className="text-sm font-medium">
                  Tags (comma separated)
                </label>
                <Input
                  id="tags"
                  placeholder="design, react, ui"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  maxLength={80}
                />
              </div>
              <div className="flex items-center gap-3">
                <Button type="submit" disabled={!canPost} className="bg-emerald-600 hover:bg-emerald-700">
                  Publish
                </Button>
                <Button type="button" variant="ghost" onClick={() => router.push("/")}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default function CreatePostPage() {
  return (
    <AuthProvider>
      <CreatePostContent />
    </AuthProvider>
  )
}
