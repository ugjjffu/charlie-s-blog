"use client";
import Link from "next/link";

export default function BlogCard({ post, index }) {
  const formattedDate = post.date
    ? new Date(post.date + "T00:00:00").toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "";

  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group block"
      style={{ animationDelay: `${index * 0.07}s` }}
    >
      <article
        className="relative bg-white rounded-2xl p-6 transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-lg border border-transparent group-hover:border-warm"
        style={{
          boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
          animation: "fadeUp 0.55s cubic-bezier(0.16,1,0.3,1) both",
          animationDelay: `${index * 0.07}s`,
        }}
      >
        {/* Emoji + Date Row */}
        <div className="flex items-center justify-between mb-3">
          <span className="text-2xl">{post.coverEmoji}</span>
          <span className="text-xs font-medium" style={{ color: "#6b6b6b" }}>
            {formattedDate}
          </span>
        </div>

        {/* Title */}
        <h2
          className="text-xl font-semibold mb-2 group-hover:text-rust transition-colors"
          style={{ fontFamily: "'Playfair Display', Georgia, serif", color: "#1a1a1a" }}
        >
          {post.title}
        </h2>

        {/* Excerpt */}
        {post.excerpt && (
          <p className="text-sm leading-relaxed mb-3 line-clamp-2" style={{ color: "#6b6b6b" }}>
            {post.excerpt}
          </p>
        )}

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs font-medium px-2.5 py-0.5 rounded-full"
                style={{ backgroundColor: "#f0ebe5", color: "#6b6b6b" }}
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Read more arrow */}
        <div className="mt-4 flex items-center gap-1.5 text-sm font-medium opacity-0 group-hover:opacity-100 translate-x-0 group-hover:translate-x-1 transition-all duration-300" style={{ color: "#c25b3e" }}>
          Read more <span className="text-base">→</span>
        </div>
      </article>
    </Link>
  );
}
