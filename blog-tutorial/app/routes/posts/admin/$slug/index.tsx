import { json, redirect } from "@remix-run/node";
import {
  Form,
  Link,
  useActionData,
  useLoaderData,
  useTransition,
} from "@remix-run/react";
import { getPost, updatePost } from "~/models/post.server";
import invariant from "tiny-invariant";
import type {
  Request,
  Values,
  ActionData,
} from "~/routes/posts/admin/form-utils";
import {
  formStringValue,
  LabelledInput,
  LabelledTextArea,
  SubmitButton,
} from "~/routes/posts/admin/form-utils";
import PostAdminIndex from "~/routes/posts/admin/index";

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

  const title = formStringValue(data, "title");
  const slug = formStringValue(data, "slug");
  const markdown = formStringValue(data, "markdown");

  let response;

  if (title && slug && markdown) {
    await updatePost({ title, slug, markdown });
    response = redirect("/posts/admin");
  } else {
    const errors: Values = {
      title: title ? null : "Title is required",
      slug: slug ? null : "Slug is required",
      markdown: markdown ? null : "Markdown is required",
    };
    response = json({ errors, values: { title, slug, markdown } });
  }

  return response;
}

export default function EditPost() {
  const { slug, title, markdown } = useLoaderData<typeof loader>();
  const data = useActionData<ActionData>();

  const transition = useTransition();

  return transition.submission ? (
    <PostAdminIndex />
  ) : (
    <div>
      <div className="flex justify-end">
        <Link to="delete" className="text-red-700">
          Delete
        </Link>
      </div>
      <Form method="post">
        <p>
          <LabelledInput
            name="title"
            defaultValue={data?.values.title || title}
            error={data?.errors.title}
          />
        </p>
        <p>
          <label>
            Slug: {slug}
            <input type="hidden" name="slug" value={slug} />
          </label>
        </p>
        <p>
          <LabelledTextArea
            name="markdown"
            defaultValue={data?.values.markdown || markdown}
            error={data?.errors.markdown}
          />
        </p>
        <p className="text-right">
          <input type="hidden" name="action" value="update" />
          <SubmitButton text="Edit" />
        </p>
      </Form>
    </div>
  );
}
