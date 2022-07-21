import { Form, Link, useLoaderData, useTransition } from "@remix-run/react";
import { deletePost, getPost } from "~/models/post.server";
import { json, redirect } from "@remix-run/node";
import PostAdminIndex from "~/routes/posts/admin/index";
import type { Request } from "~/routes/posts/admin/form-utils";
import { formStringValue, SubmitButton } from "~/routes/posts/admin/form-utils";
import invariant from "tiny-invariant";

export const loader = async ({ params }: { params: { slug: string } }) => {
  invariant(params.slug, `params.slug is required`);

  const post = await getPost(params.slug);

  if (!post) {
    throw new Response("Not found", { status: 404 });
  }

  return json(post);
};

export async function action({ request }: Request) {
  const data = await request.formData();

  // todo: delete this (it's simulating a slower server)
  await new Promise((res) => setTimeout(res, 1000));

  const slug = formStringValue(data, "slug");

  if (slug) {
    await deletePost(slug);
    return redirect("/posts/admin");
  } else {
    throw new Response("Bad request", { status: 400 });
  }
}

export default function DeletePost() {
  const { slug, title } = useLoaderData<typeof loader>();
  const transition = useTransition();

  return transition.submission ? (
    <PostAdminIndex />
  ) : (
    <div className="space-y-4 text-center">
      <p className="text-xl uppercase text-red-700">Are you sure?</p>
      <p className="text-xs">Delete {title}???</p>
      <div className="flex justify-center gap-2">
        <Form method="post">
          <p className="text-right">
            <input type="hidden" name="slug" value={slug} />
            <input type="hidden" name="action" value="delete" />
            <SubmitButton text="Yes" />
          </p>
        </Form>
        <Link
          to={`/posts/admin/${slug}`}
          className="rounded bg-green-700 py-2 px-4 text-white"
        >
          No
        </Link>
      </div>
    </div>
  );
}
