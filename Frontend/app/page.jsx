"use client";

import { useEffect, useState } from "react";
import ParticleBackground from "@/components/particle-background";
import SiteHeader from "@/components/site-header";
import BlogCard from "@/components/blog-card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import axios from "";
function HomeContent() {
  const { toast } = useToast();
  const [posts, setPosts] = useState([]);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    setToken(storedToken);  
    getPosts();
  }, []);

  const getPosts = async () => {
    try {
      const response = await axios.get("https://dev-blog-pwrn.onrender.com/api/posts/");
      setPosts(response.data);
    } catch (error) {
      console.error("Error fetching posts:", error);
      return [];
    }
  };
  return (
    <div className="relative min-h-screen">
      <ParticleBackground className="opacity-90" />

      <SiteHeader />

      <main className="mx-auto max-w-6xl px-4 py-10">
        <section className="relative overflow-hidden rounded-2xl border bg-gradient-to-br from-emerald-50 to-white p-8">
          <div className="max-w-2xl">
            <h1 className="text-3xl font-semibold tracking-tight">
              A modern, minimal blog
            </h1>
            <p className="mt-2 text-muted-foreground">
              Write, publish, and explore. Thoughtful UI with micro-particles
              for a calm vibe.
            </p>
          </div>
          {!token ? (
            <div className="mt-6">
              <Button asChild className="bg-emerald-600 hover:bg-emerald-700">
                <a href="/login">Login to start writing</a>
              </Button>
            </div>
          ) : null}
        </section>

        <section className="mb-20 mt-10">
          <h2 className="text-xl font-semibold tracking-tight">Latest posts</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {posts.length === 0 ? (
              <div className="text-muted-foreground">No posts yet.</div>
            ) : (
              posts.map((p) => (
                <BlogCard
                  key={p._id}
                  id={p._id}
                  title={p.title}
                  content={p.content}
                  author={p.author}
                  date={p.date}
                  tags={p.tags}
                />
              ))
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

export default function Page() {
  return <HomeContent />;
}
