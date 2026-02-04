"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "bg-cream/95 backdrop-blur-sm shadow-sm" : "bg-transparent"
        }`}
      style={{ backgroundColor: scrolled ? "rgba(245,240,235,0.95)" : "transparent" }}
    >
      <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <span className="text-xl">✦</span>
          <span
            className="text-lg font-semibold tracking-tight transition-colors group-hover:text-rust"
            style={{ fontFamily: "'Playfair Display', Georgia, serif", color: "#1a1a1a" }}
          >
            Charlie
          </span>
        </Link>

        {/* Nav Links */}
        <div className="flex items-center gap-6">
          <Link
            href="/project"
            className="text-sm font-medium tracking-wide relative group"
            style={{ color: "#6b6b6b" }}
          >
            Project
            <span
              className="absolute -bottom-1 left-0 w-0 h-0.5 group-hover:w-full transition-all duration-300"
              style={{ backgroundColor: "#c25b3e" }}
            />
          </Link>
          <Link
            href="/"
            className="text-sm font-medium tracking-wide relative group"
            style={{ color: "#6b6b6b" }}
          >
            Posts
            <span
              className="absolute -bottom-1 left-0 w-0 h-0.5 group-hover:w-full transition-all duration-300"
              style={{ backgroundColor: "#c25b3e" }}
            />
          </Link>
          {/* <Link
            href="/new"
            className="text-sm font-medium px-4 py-1.5 rounded-full transition-all duration-200 hover:shadow-md"
            style={{
              backgroundColor: "#1a1a1a",
              color: "#fff",
            }}
          >
            + New Post
          </Link> */}
        </div>
      </div>
    </nav>
  );
}