"use client";
import { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Link from "next/link";
import Navbar from "./Navbar";

const EMOJIS = ["📝", "💡", "🚀", "🌿", "🎨", "📚", "⚡", "🔬", "🌍", "✨", "🎯", "💻", "🍃", "🌙", "🔥"];

export default function MarkdownEditor({ initialPost = null }) {
  const [title, setTitle] = useState(initialPost?.title || "");
  const [content, setContent] = useState(initialPost?.content || "");
  const [tags, setTags] = useState(initialPost?.tags || []);
  const [tagInput, setTagInput] = useState("");
  const [coverEmoji, setCoverEmoji] = useState(initialPost?.coverEmoji || "📝");
  const [showPreview, setShowPreview] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);
  const textRef = useRef(null);
  const emojiRef = useRef(null);

  // Close emoji picker on outside click
  useEffect(() => {
    const handler = (e) => {
      if (emojiRef.current && !emojiRef.current.contains(e.target)) {
        setShowEmojiPicker(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Toast auto-dismiss
  useEffect(() => {
    if (toast) {
      const t = setTimeout(() => setToast(null), 2400);
      return () => clearTimeout(t);
    }
  }, [toast]);

  // ─── Toolbar helpers (insert markdown snippets at cursor) ───
  const insertSnippet = (before, after = "") => {
    const ta = textRef.current;
    if (!ta) return;
    const start = ta.selectionStart;
    const end = ta.selectionEnd;
    const selected = content.slice(start, end);
    const newContent =
      content.slice(0, start) + before + selected + after + content.slice(end);
    setContent(newContent);
    // Restore cursor after re-render
    setTimeout(() => {
      ta.focus();
      const newPos = start + before.length + selected.length + after.length;
      ta.setSelectionRange(newPos, newPos);
    }, 0);
  };

  const toolbarActions = [
    { label: "B", title: "Bold", action: () => insertSnippet("**", "**") },
    { label: "I", title: "Italic", action: () => insertSnippet("*", "*") },
    { label: "< >", title: "Code", action: () => insertSnippet("`", "`") },
    { label: "H2", title: "Heading 2", action: () => insertSnippet("\n## ") },
    { label: "H3", title: "Heading 3", action: () => insertSnippet("\n### ") },
    { label: "• List", title: "Bullet list", action: () => insertSnippet("\n- ") },
    { label: "1. List", title: "Numbered list", action: () => insertSnippet("\n1. ") },
    { label: '" Quote', title: "Blockquote", action: () => insertSnippet("\n> ") },
    {
      label: "```",
      title: "Code block",
      action: () => insertSnippet("\n```\n", "\n```\n"),
    },
    {
      label: "🔗",
      title: "Link",
      action: () => insertSnippet("[", "](url)"),
    },
  ];

  // ─── Add / remove tags ───
  const addTag = () => {
    const t = tagInput.trim().toLowerCase();
    if (t && !tags.includes(t)) setTags([...tags, t]);
    setTagInput("");
  };
  const removeTag = (t) => setTags(tags.filter((x) => x !== t));

  // ─── Save / Update ───
  const handleSave = async () => {
    if (!title.trim() || !content.trim()) {
      setToast("Title and content are required.");
      return;
    }
    setSaving(true);

    try {
      if (initialPost) {
        // UPDATE
        const res = await fetch("/api/blogs", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ slug: initialPost.slug, title, content, tags, coverEmoji }),
        });
        if (!res.ok) throw new Error("Failed to update.");
        setToast("Post updated!");
      } else {
        // CREATE
        const res = await fetch("/api/blogs", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title, content, tags, coverEmoji }),
        });
        if (!res.ok) throw new Error("Failed to create.");
        const { slug } = await res.json();
        setToast("Post published!");
        // Redirect after short delay so toast is visible
        setTimeout(() => {
          window.location.href = `/blog/${slug}`;
        }, 1200);
        return; // don't re-enable saving
      }
    } catch (err) {
      setToast(err.message);
    }
    setSaving(false);
  };

  // ─── Delete ───
  const handleDelete = async () => {
    if (!initialPost) return;
    if (!window.confirm("Delete this post permanently?")) return;
    try {
      const res = await fetch("/api/blogs", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug: initialPost.slug }),
      });
      if (!res.ok) throw new Error("Failed to delete.");
      window.location.href = "/";
    } catch (err) {
      setToast(err.message);
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#f5f0eb" }}>
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 pt-28 pb-16">
        {/* ─── Header Row ─── */}
        <div className="flex items-center justify-between mb-6">
          <Link href="/" className="text-sm font-medium flex items-center gap-1.5 hover:text-rust transition-colors" style={{ color: "#6b6b6b" }}>
            ← Back to posts
          </Link>
          <div className="flex items-center gap-3">
            {initialPost && (
              <button
                onClick={handleDelete}
                className="text-xs font-medium px-3 py-1.5 rounded-full transition-all hover:bg-red-100"
                style={{ color: "#c0392b" }}
              >
                Delete
              </button>
            )}
            <button
              onClick={handleSave}
              disabled={saving}
              className="text-sm font-semibold px-5 py-1.5 rounded-full text-white transition-all duration-200 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ backgroundColor: saving ? "#a0a0a0" : "#c25b3e" }}
            >
              {saving ? "Saving…" : initialPost ? "Update Post" : "Publish Post"}
            </button>
          </div>
        </div>

        {/* ─── Emoji Picker ─── */}
        <div className="relative mb-4" ref={emojiRef}>
          <button
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            className="text-3xl hover:scale-110 transition-transform"
          >
            {coverEmoji}
          </button>
          {showEmojiPicker && (
            <div className="absolute top-10 left-0 bg-white rounded-xl shadow-lg p-3 z-10 flex flex-wrap gap-2 w-64">
              {EMOJIS.map((e) => (
                <button
                  key={e}
                  onClick={() => { setCoverEmoji(e); setShowEmojiPicker(false); }}
                  className={`text-xl p-1.5 rounded-lg hover:bg-warm transition-colors ${coverEmoji === e ? "ring-2 ring-rust" : ""}`}
                >
                  {e}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ─── Title ─── */}
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Your post title…"
          className="w-full text-3xl font-semibold bg-transparent outline-none placeholder-ash mb-4"
          style={{ fontFamily: "'Playfair Display', Georgia, serif", color: "#1a1a1a" }}
        />

        {/* ─── Tags ─── */}
        <div className="flex flex-wrap items-center gap-2 mb-6">
          {tags.map((t) => (
            <span key={t} className="flex items-center gap-1 text-xs font-medium px-2.5 py-0.5 rounded-full" style={{ backgroundColor: "#e8ddd3", color: "#6b6b6b" }}>
              {t}
              <button onClick={() => removeTag(t)} className="hover:text-rust transition-colors ml-0.5">×</button>
            </span>
          ))}
          <input
            type="text"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter" || e.key === ",") { e.preventDefault(); addTag(); } }}
            placeholder="Add tag…"
            className="text-xs bg-transparent outline-none placeholder-ash w-28"
            style={{ color: "#6b6b6b" }}
          />
        </div>

        {/* ─── Preview Toggle ─── */}
        <div className="flex items-center gap-1 mb-3 rounded-lg overflow-hidden border" style={{ borderColor: "#e8ddd3" }}>
          <button
            onClick={() => setShowPreview(false)}
            className={`flex-1 text-xs font-semibold py-1.5 transition-colors ${!showPreview ? "bg-ink text-white" : "hover:bg-warm"}`}
            style={{ backgroundColor: !showPreview ? "#1a1a1a" : "transparent", color: !showPreview ? "#fff" : "#6b6b6b" }}
          >
            Editor
          </button>
          <button
            onClick={() => setShowPreview(true)}
            className={`flex-1 text-xs font-semibold py-1.5 transition-colors`}
            style={{ backgroundColor: showPreview ? "#1a1a1a" : "transparent", color: showPreview ? "#fff" : "#6b6b6b" }}
          >
            Preview
          </button>
        </div>

        {/* ─── Editor / Preview ─── */}
        {!showPreview ? (
          <>
            {/* Toolbar */}
            <div className="flex flex-wrap gap-1.5 mb-3 p-2 rounded-lg" style={{ backgroundColor: "#fff" }}>
              {toolbarActions.map((btn) => (
                <button
                  key={btn.label}
                  title={btn.title}
                  onClick={btn.action}
                  className="text-xs font-semibold px-2.5 py-1 rounded-md transition-colors hover:bg-warm"
                  style={{ color: "#6b6b6b", border: "1px solid #e8ddd3" }}
                >
                  {btn.label}
                </button>
              ))}
            </div>

            {/* Textarea */}
            <textarea
              ref={textRef}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={"Write your blog post in Markdown…\n\n## Heading\n\nParagraph text here."}
              rows={22}
              className="w-full bg-white rounded-xl p-5 outline-none resize-none text-sm leading-relaxed"
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                color: "#1a1a1a",
                border: "1px solid #e8ddd3",
                minHeight: "480px",
              }}
            />
          </>
        ) : (
          <div
            className="bg-white rounded-xl p-6 prose"
            style={{ border: "1px solid #e8ddd3", minHeight: "480px" }}
          >
            {content ? (
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
            ) : (
              <p className="text-ash italic">Nothing to preview yet…</p>
            )}
          </div>
        )}

        {/* ─── Markdown Cheat Sheet ─── */}
        <details className="mt-6">
          <summary className="text-xs font-semibold cursor-pointer select-none" style={{ color: "#6b6b6b" }}>
            Markdown cheat sheet ▾
          </summary>
          <div className="mt-2 grid grid-cols-2 gap-x-6 gap-y-1 text-xs" style={{ color: "#6b6b6b" }}>
            {[
              ["# Heading 1", "H1"],
              ["## Heading 2", "H2"],
              ["**bold**", "Bold"],
              ["*italic*", "Italic"],
              ["`code`", "Inline code"],
              ["[text](url)", "Link"],
              ["- item", "Bullet list"],
              ["1. item", "Numbered list"],
              ["> quote", "Blockquote"],
              ["```\\ncode\\n```", "Code block"],
              ["---", "Horizontal rule"],
              ["| H1 | H2 |", "Table"],
            ].map(([syntax, label]) => (
              <div key={label} className="flex justify-between">
                <code className="font-mono" style={{ color: "#c25b3e" }}>{syntax}</code>
                <span>{label}</span>
              </div>
            ))}
          </div>
        </details>
      </div>

      {/* ─── Toast ─── */}
      <div className={`toast ${toast ? "show" : ""}`}>{toast}</div>
    </div>
  );
}
