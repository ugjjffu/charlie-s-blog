import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Navbar from "../../../components/Navbar";
import { getPostBySlug } from "../../../lib/posts";

export default function BlogDetailPage({ params }) {
  const post = getPostBySlug(params.slug);

  if (!post) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center" style={{ backgroundColor: "#f5f0eb" }}>
        <p className="text-6xl mb-4">🔍</p>
        <h1 className="text-2xl font-semibold mb-2" style={{ fontFamily: "'Playfair Display', serif", color: "#1a1a1a" }}>
          Post not found
        </h1>
        <Link href="/" className="text-sm mt-2 hover:underline" style={{ color: "#c25b3e" }}>
          ← Back to posts
        </Link>
      </div>
    );
  }

  const formattedDate = post.date
    ? new Date(post.date + "T00:00:00").toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "";

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#f5f0eb" }}>
      <Navbar />

      <article className="max-w-3xl mx-auto px-6 pt-28 pb-24">
        {/* Back link */}
        <Link href="/" className="text-sm font-medium flex items-center gap-1.5 mb-8 hover:text-rust transition-colors" style={{ color: "#6b6b6b" }}>
          ← Back to posts
        </Link>

        {/* Cover Emoji */}
        <span className="text-5xl">{post.coverEmoji}</span>

        {/* Title */}
        <h1
          className="text-4xl font-bold mt-3 leading-tight"
          style={{ fontFamily: "'Playfair Display', Georgia, serif", color: "#1a1a1a" }}
        >
          {post.title}
        </h1>

        {/* Meta row */}
        <div className="flex items-center gap-4 mt-3 flex-wrap">
          <span className="text-sm" style={{ color: "#6b6b6b" }}>{formattedDate}</span>
          {post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs font-medium px-2.5 py-0.5 rounded-full"
                  style={{ backgroundColor: "#e8ddd3", color: "#6b6b6b" }}
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
          {/* Edit button */}
          <Link
            href={`/blog/${post.slug}/edit`}
            className="ml-auto text-xs font-semibold px-3 py-1 rounded-full transition-colors hover:bg-warm"
            style={{ color: "#c25b3e", border: "1px solid #c25b3e" }}
          >
            Edit
          </Link>
        </div>

        {/* Divider */}
        <div className="my-8 flex items-center gap-3">
          <div className="flex-1 h-px" style={{ backgroundColor: "#e8ddd3" }} />
          <span className="text-sm" style={{ color: "#c25b3e" }}>✦</span>
          <div className="flex-1 h-px" style={{ backgroundColor: "#e8ddd3" }} />
        </div>

        {/* Markdown Content */}
        <div className="prose">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{post.content}</ReactMarkdown>
        </div>
      </article>
    </div>
  );
}
