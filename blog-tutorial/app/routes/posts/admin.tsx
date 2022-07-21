import { json } from "@remix-run/node";
import { Link, Outlet, useLoaderData, useTransition } from "@remix-run/react";

import type { Post } from "~/models/post.server";
import { getPosts } from "~/models/post.server";

export async function loader() {
  return json({ posts: await getPosts() });
}

export default function PostAdminRoute() {
  const { posts } = useLoaderData<typeof loader>();

  return <PostAdmin posts={posts} />;
}

type PostLink = Pick<Post, "slug" | "title">;

export function PostAdmin({ posts }: { posts: PostLink[] }) {
  const { submission } = useTransition();

  const renderLi = (
    slug: FormDataEntryValue | string | null,
    title: FormDataEntryValue | string | null
  ) => {
    if (slug && title) {
      const _slug = slug.toString();
      return (
        <li key={_slug}>
          <Link to={_slug} className="text-blue-600 underline">
            {title.toString()}
          </Link>
        </li>
      );
    }
    return null;
  };

  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="my-6 mb-2 border-b-2 text-center text-3xl">Blog Admin</h1>
      <div className="grid grid-cols-4 gap-6">
        <nav className="col-span-4 md:col-span-1">
          <ul>
            {posts.map(({ slug, title }) => renderLi(slug, title))}
            {submission
              ? renderLi(
                  submission.formData.get("slug"),
                  submission.formData.get("title")
                )
              : null}
          </ul>
        </nav>
        <main className="col-span-4 md:col-span-3">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
