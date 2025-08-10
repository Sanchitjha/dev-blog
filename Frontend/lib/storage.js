export function ensureSeed() {
  if (typeof window === "undefined") return
  const seeded = localStorage.getItem("blog_seeded_v1")
  if (seeded) return
  const demoUser = { name: "Ava Harper", email: "ava@example.com" }
  const now = Date.now()
  const demo = [
    {
      id: "p_" + now,
      title: "Designing Calm Interfaces",
      content:
        "Micro-interactions, gentle motion, and restrained palettes can make apps feel calm. Here's how I approach it: spacing first, then motion, then color.",
      author: demoUser,
      date: new Date(now - 1000 * 60 * 60 * 24 * 2).toISOString(),
      tags: ["design", "ux", "motion"],
    },
    {
      id: "p_" + (now + 1),
      title: "The Joy of Small Side Projects",
      content:
        "Side projects are sandboxes. They teach you to ship, to scope, and to enjoy the craft. Here are three tiny projects that taught me big lessons.",
      author: { name: "Leo Ramos", email: "leo@example.com" },
      date: new Date(now - 1000 * 60 * 60 * 24 * 4).toISOString(),
      tags: ["productivity", "career"],
    },
  ]
  localStorage.setItem("posts", JSON.stringify(demo))
  localStorage.setItem("blog_seeded_v1", "1")
}

export function getPosts() {
  if (typeof window === "undefined") return []
  const raw = localStorage.getItem("posts")
  return raw ? safeParse(raw, []) : []
}

export function savePosts(posts) {
  if (typeof window === "undefined") return
  localStorage.setItem("posts", JSON.stringify(posts))
}

export function addPost({ title, content, tags = [], author }) {
  const posts = getPosts()
  const id = "p_" + Date.now() + "_" + Math.random().toString(36).slice(2, 8)
  const post = {
    id,
    title,
    content,
    author,
    date: new Date().toISOString(),
    tags,
  }
  posts.unshift(post)
  savePosts(posts)
  return post
}

export function deletePost(id) {
  const posts = getPosts()
  const filtered = posts.filter((p) => p.id !== id)
  savePosts(filtered)
  return filtered
}

export function getPostById(id) {
  return getPosts().find((p) => p.id === id) || null
}

function safeParse(str, fallback) {
  try {
    return JSON.parse(str)
  } catch {
    return fallback
  }
}
