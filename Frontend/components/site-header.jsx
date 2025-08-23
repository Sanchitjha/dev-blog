"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { LogIn, LogOut, PenLine, User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function SiteHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const initials = localStorage.getItem("user");
  const token = localStorage.getItem("token");

  const isActive = (href) =>
    pathname === href ? "text-foreground" : "text-muted-foreground";

  const goToCreate = () => {
    router.push("/create-post");
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/login");
  };
  console.log(token);

  return (
    <header className="sticky top-0 z-20 w-full border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-14 max-w-6xl items-center gap-3 px-4">
        <Link href="/" className="font-semibold tracking-tight">
          <span className="rounded-md bg-emerald-600 px-2 py-0.5 text-white">
            Dev
          </span>{" "}
          Blog
        </Link>

        <nav className="ml-6 hidden items-center gap-5 text-sm md:flex">
          <Link
            href="/"
            className={`hover:text-foreground transition ${isActive("/")}`}
          >
            Home
          </Link>
        </nav>

        <div className="ml-auto flex items-center gap-2">
          {token ? (
            <>
              <Button
                variant="outline"
                className="hidden border-emerald-200 bg-transparent md:inline-flex"
                onClick={goToCreate}
              >
                <PenLine className="mr-2 h-4 w-4" />
                New Post
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="h-9 w-9 p-0"
                    aria-label="Open user menu"
                  >
                    <Avatar className="h-9 w-9 border">
                      <AvatarFallback className="text-[0.8rem]">
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Account
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/profile">Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={goToCreate}>
                    <PenLine className="mr-2 h-4 w-4" />
                    New Post
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="text-red-600 focus:text-red-700"
                    onClick={logout}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <Button asChild className="bg-emerald-600 hover:bg-emerald-700">
              <Link href="/login">
                <LogIn className="mr-2 h-4 w-4" />
                Login
              </Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
