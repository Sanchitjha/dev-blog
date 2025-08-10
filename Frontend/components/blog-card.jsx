"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import Link from "next/link"

export default function BlogCard({
  id = "post-1",
  title = "Untitled Post",
  content = "No content yet.",
  author = { name: "Guest" },
  date = new Date().toISOString(),
  tags = [],
  onDelete = null,
  canDelete = false,
}) {
  const initials = (author?.name || "G")
    .split(" ")
    .map((s) => s[0]?.toUpperCase())
    .slice(0, 2)
    .join("")

  const prettyDate = new Date(date).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  })

  const excerpt = typeof content === "string" ? (content.length > 180 ? content.slice(0, 180) + "…" : content) : ""

  return (
    <Card className="group transition-all hover:shadow-lg hover:border-emerald-200/60">
      <CardHeader className="flex flex-row items-center gap-4">
        <Avatar className="border">
          <AvatarFallback>{initials || "U"}</AvatarFallback>
        </Avatar>
        <div className="space-y-1">
          <CardTitle className="text-xl">{title}</CardTitle>
          <div className="text-sm text-muted-foreground">
            by {author?.name || "Unknown"} • {prettyDate}
          </div>
        </div>
        <div className="ml-auto flex gap-2">
          {tags?.slice(0, 3).map((t, i) => (
            <Badge key={i} variant="secondary" className="text-xs">
              {t}
            </Badge>
          ))}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-muted-foreground leading-relaxed">{excerpt}</p>
        <div className="flex gap-2">
          <Button asChild variant="outline" className="border-emerald-200 hover:bg-emerald-50 bg-transparent">
            <Link href={`/posts/${id}`}>Read</Link>
          </Button>
          {canDelete && onDelete ? (
            <Button
              variant="ghost"
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
              onClick={() => onDelete(id)}
            >
              Delete
            </Button>
          ) : null}
        </div>
      </CardContent>
    </Card>
  )
}
