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

function PostLinkLi({
  slug,
  title,
  className = "text-blue-600 underline",
}: {
  slug?: FormDataEntryValue | string | null;
  title?: FormDataEntryValue | string | null;
  className?: string;
}) {
  if (slug && title) {
    return (
      <li>
        <Link to={slug.toString()} className={className}>
          {title.toString()}
        </Link>
      </li>
    );
  }
  return null;
}

export function PostAdmin({
  posts,
}: {
  posts: Pick<Post, "slug" | "title">[];
}) {
  const { submission } = useTransition();

  const formAction = submission?.formData.get("action");
  const formTitle = submission?.formData.get("title");
  const formSlug = submission?.formData.get("slug");

  const _posts =
    formAction === "delete"
      ? posts.filter(({ slug }) => slug !== formSlug)
      : posts;

  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="my-6 mb-2 border-b-2 text-center text-3xl">Blog Admin</h1>
      <div className="grid grid-cols-4 gap-6">
        <nav className="col-span-4 md:col-span-1">
          <ul>
            {_posts.map(({ slug, title }) => (
              <PostLinkLi
                key={slug}
                slug={slug}
                title={
                  slug === formSlug && formTitle ? formTitle.toString() : title
                }
                className={slug === formSlug ? "text-yellow-700" : undefined}
              />
            ))}
            {submission && formAction === "create" ? (
              <PostLinkLi
                slug={formSlug}
                title={formTitle}
                className="text-green-700"
              />
            ) : null}
          </ul>
        </nav>
        <main className="col-span-4 md:col-span-3">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
