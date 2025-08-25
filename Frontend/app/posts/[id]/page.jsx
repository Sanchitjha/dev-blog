"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import ParticleBackground from "@/components/particle-background";
import Link from "next/link";

export default function PostPage() {
  const params = useParams();
  const router = useRouter();
  const [post, setPost] = useState(null);

  useEffect(() => {
    if (!params?.id) return;
    console.log("Fetching post with ID:", params.id);
    const getpost = async () => {
      const response = await fetch(
        `https://dev-blog-pwrn.onrender.com/api/posts/${params.id}`
      );
      const data = await response.json();
      setPost(data);
    };
    getpost();
  }, [params?.id]);

  if (!post) {
    return (
      <div className="relative min-h-screen">
        <ParticleBackground className="opacity-90" />
        <div className="mx-auto max-w-3xl px-4 py-10">
          <Button variant="ghost" asChild>
            <Link href="/">← Back</Link>
          </Button>
          <div className="mt-10 rounded-lg border bg-white/90 p-6">
            <h1 className="text-2xl font-semibold">Post not found</h1>
            <p className="mt-2 text-muted-foreground">
              It may have been deleted.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const prettyDate = new Date(post.date).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <div className="relative min-h-screen">
      <ParticleBackground className="opacity-90" />
      <div className="mx-auto max-w-3xl px-4 py-10">
        <Button variant="ghost" onClick={() => router.back()}>
          ← Back
        </Button>
        <article className="mt-6 rounded-2xl border bg-white/90 p-6 md:p-10">
          <header className="mb-6">
            <h1 className="text-3xl font-semibold tracking-tight">
              {post.title}
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              by {post.author?.name || "Unknown"} • {prettyDate}
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {post.tags?.map((t, i) => (
                <span
                  key={i}
                  className="rounded-md border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-xs text-emerald-900"
                >
                  {t}
                </span>
              ))}
            </div>
          </header>
          <div className="prose max-w-none text-[15px] leading-7 text-neutral-700">
            {post.content}
          </div>
        </article>
      </div>
    </div>
  );
}
