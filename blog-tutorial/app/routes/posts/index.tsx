import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { getPosts } from "~/models/post.server";

export async function loader() {
  return json({
    posts: await getPosts(),
  });
}

export default function Posts() {
  const { posts } = useLoaderData<typeof loader>();

  return (
    <main className="m-4 space-y-4">
      <h1>Posts</h1>
      <ul className="mt-4 ml-4 space-y-4">
        {posts.map((post) => (
          <li key={post.slug} className="text-blue-700 underline">
            <Link to={post.slug}>{post.title}</Link>
          </li>
        ))}
      </ul>
      <Link to="admin" className="block text-purple-700 underline">
        Admin
      </Link>
    </main>
  );
}
