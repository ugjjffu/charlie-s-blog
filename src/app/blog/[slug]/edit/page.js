"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import MarkdownEditor from "../../../../components/MarkdownEditor";

export default function EditPage() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`/api/blogs?slug=${slug}`)
      .then((res) => {
        if (!res.ok) throw new Error("Post not found");
        return res.json();
      })
      .then((data) => {
        setPost(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "#f5f0eb" }}>
        <p className="text-sm animate-pulse" style={{ color: "#6b6b6b" }}>Loading…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center" style={{ backgroundColor: "#f5f0eb" }}>
        <p className="text-lg font-semibold" style={{ color: "#1a1a1a" }}>Post not found</p>
        <a href="/" className="text-sm mt-2" style={{ color: "#c25b3e" }}>← Back</a>
      </div>
    );
  }

  return <MarkdownEditor initialPost={post} />;
}
