# MyBlog — A Next.js Markdown Blog

A clean, fully-featured personal blog built with **Next.js 14** where every post is stored as a `.md` (Markdown) file on disk.

---

## ✨ Features

- **Write & Publish** posts with a rich Markdown editor and live preview
- **Edit & Delete** posts from the UI
- **Markdown toolbar** — bold, italic, code, headings, lists, blockquotes, links, code blocks
- **Tag system** — add tags to categorise posts
- **Cover emoji** — pick an emoji to represent each post
- **Responsive** — looks great on desktop and mobile
- **Two sample posts** included to get you started

---

## 🚀 Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Build for production

```bash
npm run build
npm run start
```

---

## 📁 Project Structure

```
├── content/
│   └── blogs/              ← Your .md blog files live here
├── src/
│   ├── app/
│   │   ├── layout.js       ← Root layout
│   │   ├── page.js         ← Home / listing page
│   │   ├── new/
│   │   │   └── page.js     ← New post editor
│   │   ├── blog/
│   │   │   └── [slug]/
│   │   │       ├── page.js       ← Blog detail (read) page
│   │   │       └── edit/
│   │   │           └── page.js   ← Edit page
│   │   └── api/
│   │       └── blogs/
│   │           └── route.js      ← REST API (GET/POST/PUT/DELETE)
│   ├── components/
│   │   ├── Navbar.js       ← Top navigation bar
│   │   ├── BlogCard.js     ← Post card on the listing page
│   │   └── MarkdownEditor.js ← Full editor with toolbar & preview
│   ├── lib/
│   │   └── posts.js        ← File-system helpers (read/write .md)
│   └── styles/
│       └── globals.css     ← Tailwind + custom prose styles
├── package.json
├── tailwind.config.js
├── postcss.config.js
└── next.config.js
```

---

## 📝 How Blog Posts Work

Each blog post is a single `.md` file inside `content/blogs/`. The file uses **front matter** (YAML at the top) to store metadata:

```markdown
---
title: My First Post
date: 2025-01-20
excerpt: A short summary shown on the listing page.
tags:
  - intro
  - hello
coverEmoji: 🌱
---

## Body starts here

Write your post in standard Markdown…
```

| Field | Description |
|-------|-------------|
| `title` | The post title |
| `date` | Publication date (`YYYY-MM-DD`) |
| `excerpt` | Short summary (auto-generated if omitted) |
| `tags` | Array of tag strings |
| `coverEmoji` | Emoji displayed on the card & detail page |

---

## 🛠 API Reference

The blog exposes a simple REST API at `/api/blogs`:

| Method | Endpoint | Body | Description |
|--------|----------|------|-------------|
| GET | `/api/blogs` | — | Returns all posts (metadata) |
| GET | `/api/blogs?slug=xxx` | — | Returns one full post |
| POST | `/api/blogs` | `{ title, content, tags, coverEmoji }` | Creates a new post |
| PUT | `/api/blogs` | `{ slug, title, content, tags, coverEmoji }` | Updates a post |
| DELETE | `/api/blogs` | `{ slug }` | Deletes a post |

---

## 🎨 Tech Stack

| Technology | Role |
|------------|------|
| Next.js 14 | Framework (App Router) |
| React 18 | UI library |
| Tailwind CSS | Utility-first styling |
| gray-matter | Parsing Markdown front matter |
| react-markdown | Rendering Markdown to HTML |
| remark-gfm | GitHub-Flavoured Markdown support |
| uuid | Generating unique post slugs |

---

## 📚 Supported Markdown Syntax

- Headings (`#`, `##`, `###`)
- Bold / Italic (`**bold**`, `*italic*`)
- Inline code and fenced code blocks
- Blockquotes
- Ordered & unordered lists
- Links and images
- Tables (GFM)
- Horizontal rules (`---`)
