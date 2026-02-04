import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { v4 as uuidv4 } from "uuid";

// ─── Directory where .md blog files live ───
const BLOGS_DIR = path.resolve(process.cwd(), "content", "blogs");

// Ensure the directory exists at startup
if (!fs.existsSync(BLOGS_DIR)) {
  fs.mkdirSync(BLOGS_DIR, { recursive: true });
}

// ─── Helper: slugify a title ───
function slugify(title) {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

// ─── Read all blog posts (metadata only) ───
export function getAllPosts() {
  const files = fs.readdirSync(BLOGS_DIR).filter((f) => f.endsWith(".md"));

  const posts = files.map((file) => {
    const filePath = path.join(BLOGS_DIR, file);
    const fileContent = fs.readFileSync(filePath, "utf-8");
    const { data } = matter(fileContent);

    return {
      slug: file.replace(".md", ""),
      title: data.title || "Untitled",
      date: data.date || null,
      excerpt: data.excerpt || "",
      tags: data.tags || [],
      coverEmoji: data.coverEmoji || "📝",
    };
  });

  // Sort newest first
  posts.sort((a, b) => new Date(b.date) - new Date(a.date));
  return posts;
}

// ─── Read a single blog post (full content) ───
export function getPostBySlug(slug) {
  const filePath = path.join(BLOGS_DIR, `${slug}.md`);
  if (!fs.existsSync(filePath)) return null;

  const fileContent = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(fileContent);

  return {
    slug,
    title: data.title || "Untitled",
    date: data.date || null,
    excerpt: data.excerpt || "",
    tags: data.tags || [],
    coverEmoji: data.coverEmoji || "📝",
    content,
  };
}

// ─── Create a new blog post ───
export function createPost({ title, content, tags, coverEmoji }) {
  if (!title || !content) {
    throw new Error("Title and content are required.");
  }

  const slug = slugify(title) + "-" + uuidv4().slice(0, 8);
  const filePath = path.join(BLOGS_DIR, `${slug}.md`);

  // Build the excerpt from content (first 150 chars, no markdown)
  const plainText = content.replace(/[#*_`\[\]()>-]/g, "").trim();
  const excerpt = plainText.length > 150 ? plainText.slice(0, 150) + "…" : plainText;

  const frontmatter = {
    title,
    date: new Date().toISOString().split("T")[0], // YYYY-MM-DD
    excerpt,
    tags: tags || [],
    coverEmoji: coverEmoji || "📝",
  };

  const fileContent = matter.stringify(content, frontmatter);
  fs.writeFileSync(filePath, fileContent, "utf-8");

  return { slug };
}

// ─── Update an existing blog post ───
export function updatePost(slug, { title, content, tags, coverEmoji }) {
  const filePath = path.join(BLOGS_DIR, `${slug}.md`);
  if (!fs.existsSync(filePath)) {
    throw new Error("Post not found.");
  }

  const plainText = content.replace(/[#*_`\[\]()>-]/g, "").trim();
  const excerpt = plainText.length > 150 ? plainText.slice(0, 150) + "…" : plainText;

  const frontmatter = {
    title: title || "Untitled",
    date: new Date().toISOString().split("T")[0],
    excerpt,
    tags: tags || [],
    coverEmoji: coverEmoji || "📝",
  };

  const fileContent = matter.stringify(content, frontmatter);
  fs.writeFileSync(filePath, fileContent, "utf-8");

  return { slug };
}

// ─── Delete a blog post ───
export function deletePost(slug) {
  const filePath = path.join(BLOGS_DIR, `${slug}.md`);
  if (!fs.existsSync(filePath)) {
    throw new Error("Post not found.");
  }
  fs.unlinkSync(filePath);
  return { success: true };
}
