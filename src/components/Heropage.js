"use client";
import { motion } from 'framer-motion'
import Navbar from "./Navbar";
import BlogCard from "./BlogCard";

// ─── shared spring config ───
// mass  → heavier = slower overshoot          (feels "weighty")
// stiffness → stiffer = snappier              (feels "tight")
// damping   → higher = less bounce            (feels "settled")
const spring = { 
  type: "spring", 
  mass: 0.8,      // 稍重一点
  stiffness: 100, // 中等刚度
  damping: 8      // 低阻尼 → 产生2-3次震动
};

const SKILLS = ["Next.js", "React", "TypeScript", "Node.js", "TailwindCSS", "PostgreSQL"];

export default function HeroPage({ posts }) {
  return (
    <div className="min-h-screen" style={{ backgroundColor: "#f5f0eb" }}>
      <Navbar />

      {/* ─── Hero ─── */}
      <header className="max-w-4xl mx-auto px-6 pt-28 pb-10">
        <div className="flex flex-col sm:flex-row sm:items-end gap-8">
          {/* Intro text */}
          <div className="flex-1">
            {/* "Hi, I'm" label — slides up + fades */}
            <motion.span
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...spring, delay: 0.05 }}
              className="text-xs font-semibold uppercase tracking-widest inline-block"
              style={{ color: "#c25b3e" }}
            >
              Hi, I&apos;m
            </motion.span>

            {/* Name — bigger spring, slightly later */}
            <motion.h1
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...spring, delay: 0.15 }}
              className="text-5xl font-bold leading-tight mt-1"
              style={{ fontFamily: "'Playfair Display', Georgia, serif", color: "#1a1a1a" }}
            >
              Charlie
            </motion.h1>

            {/* Bio — softer spring after name settles */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...spring, delay: 0.28 }}
              className="mt-2.5 text-base leading-relaxed max-w-xl"
              style={{ color: "#6b6b6b" }}
            >
              Experienced Next.js fullstack engineer crafting scalable web products from
              concept to deployment. I love turning complex problems into clean, elegant
              interfaces — and sharing what I learn along the way.
            </motion.p>

            {/* Skill tags — each one springs in individually, staggered */}
            <div className="flex flex-wrap gap-2 mt-4">
              {SKILLS.map((skill, i) => (
                <motion.span
                  key={skill}
                  initial={{ opacity: 0, y: 14, scale: 0.88 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ ...spring, delay: 0.38 + i * 0.06 }}
                  className="text-xs font-medium px-3 py-1 rounded-full"
                  style={{ backgroundColor: "#fff", color: "#6b6b6b", border: "1px solid #e8ddd3" }}
                >
                  {skill}
                </motion.span>
              ))}
            </div>
          </div>

          {/* Post count — springs in last */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...spring, delay: 0.72 }}
            className="flex-shrink-0"
          >
            <span
              className="text-xs font-semibold uppercase tracking-widest"
              style={{ color: "#c25b3e" }}
            >
              {posts.length} {posts.length === 1 ? "post" : "posts"}
            </span>
          </motion.div>
        </div>

        {/* Decorative rule — scale-x spring from center */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ ...spring, delay: 0.82 }}
          style={{ transformOrigin: "center" }}
          className="mt-8 flex items-center gap-3"
        >
          <div className="flex-1 h-px" style={{ backgroundColor: "#e8ddd3" }} />
          <span className="text-lg" style={{ color: "#c25b3e" }}>✦</span>
          <div className="flex-1 h-px" style={{ backgroundColor: "#e8ddd3" }} />
        </motion.div>
      </header>

      {/* ─── Blog Grid ─── */}
      <main className="max-w-4xl mx-auto px-6 pb-24">
        {posts.length === 0 ? (
          <div className="text-center py-24">
            <p className="text-4xl mb-4">📝</p>
            <p
              className="text-lg font-semibold"
              style={{ fontFamily: "'Playfair Display', serif", color: "#1a1a1a" }}
            >
              No posts yet
            </p>
            <p className="text-sm mt-1 mb-6" style={{ color: "#6b6b6b" }}>
              Start by creating your first blog post.
            </p>
            <a
              href="/new"
              className="inline-block text-sm font-semibold px-5 py-2 rounded-full text-white transition-opacity hover:opacity-90"
              style={{ backgroundColor: "#c25b3e" }}
            >
              + Write a Post
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {posts.map((post, i) => (
              <BlogCard key={post.slug} post={post} index={i} />
            ))}
          </div>
        )}
      </main>

      {/* ─── Footer ─── */}
      <footer className="text-center py-8 text-xs" style={{ color: "#6b6b6b" }}>
        Built with Next.js & Markdown
      </footer>
    </div>
  );
}