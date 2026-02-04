import { getAllPosts } from "../lib/posts";
import HeroPage from "../components/Heropage";

export default function Home() {
  const posts = getAllPosts();
  return <HeroPage posts={posts} />;
}
