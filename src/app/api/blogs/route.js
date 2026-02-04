import { NextResponse } from "next/server";
import {
  getAllPosts,
  getPostBySlug,
  createPost,
  updatePost,
  deletePost,
} from "../../../lib/posts";

// ─── GET  /api/blogs        → list all posts
// ─── GET  /api/blogs?slug=x → get one post
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get("slug");

    if (slug) {
      const post = getPostBySlug(slug);
      if (!post) {
        return NextResponse.json({ error: "Post not found" }, { status: 404 });
      }
      return NextResponse.json(post);
    }

    const posts = getAllPosts();
    return NextResponse.json(posts);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// ─── POST /api/blogs  → create a new post
//     body: { title, content, tags[], coverEmoji }
export async function POST(request) {
  try {
    const body = await request.json();
    const { slug } = createPost(body);
    return NextResponse.json({ slug }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}

// ─── PUT  /api/blogs  → update existing post
//     body: { slug, title, content, tags[], coverEmoji }
export async function PUT(request) {
  try {
    const { slug, ...data } = await request.json();
    if (!slug) {
      return NextResponse.json({ error: "Slug is required" }, { status: 400 });
    }
    await updatePost(slug, data);
    return NextResponse.json({ slug });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}

// ─── DELETE /api/blogs  → delete a post
//     body: { slug }
export async function DELETE(request) {
  try {
    const { slug } = await request.json();
    if (!slug) {
      return NextResponse.json({ error: "Slug is required" }, { status: 400 });
    }
    await deletePost(slug);
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
