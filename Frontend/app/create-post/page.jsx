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
import { Textarea } from "@/components/ui/textarea";
import ParticleBackground from "@/components/particle-background";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";
import axios from "axios";

function CreatePostContent() {
  const router = useRouter();
  const { toast } = useToast();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const [loading, setLoading] = useState(false);

  async function handlePublish(e) {
    e.preventDefault();
    setLoading(true);

    try {
      const tagList = tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean)
        .slice(0, 5);

      const token = localStorage.getItem("token");
      if (!token) {
        toast({ title: "Not logged in", description: "Please log in first." });
        setLoading(false);
        return;
      }

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL || "https://dev-blog-pwrn.onrender.com"}/api/posts`,
        { title, content, tags: tagList },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.status === 201) {
        toast({ title: "Post published", description: "Your post is live." });
        router.push("/");
      }
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description:
          error.response?.data?.message || "Failed to publish post.",
      });
    } finally {
      setLoading(false);
    }
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
            <CardDescription>
              Compose your thoughts and publish when you are ready.
            </CardDescription>
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
                <Button
                  type="submit"
                  className="bg-emerald-600 hover:bg-emerald-700"
                  disabled={loading}
                >
                  {loading ? "Publishing..." : "Publish"}
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => router.push("/")}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function CreatePostPage() {
  return <CreatePostContent />;
}
