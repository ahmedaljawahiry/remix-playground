import { Form, useActionData, useTransition } from "@remix-run/react";
import { createPost } from "~/models/post.server";
import { json, redirect } from "@remix-run/node";
import PostAdminIndex from "~/routes/posts/admin/index";

type Request = {
  request: { formData: () => Promise<FormData> };
};

type Values = {
  title: string | null;
  slug: string | null;
  markdown: string | null;
};

type ActionData =
  | {
      values: Values;
      errors: Values;
    }
  | undefined;

function formStringValue(data: FormData, key: string): string | null {
  const value = data.get(key);
  return value ? value.toString() : null;
}

export async function action({ request }: Request) {
  const data = await request.formData();

  // todo: delete this (it's simulating a slower server)
  await new Promise((res) => setTimeout(res, 1000));

  const title = formStringValue(data, "title");
  const slug = formStringValue(data, "slug");
  const markdown = formStringValue(data, "markdown");

  let response;

  if (title && slug && markdown) {
    await createPost({ title, slug, markdown });
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

const inputClassName = `w-full rounded border border-gray-500 px-2 py-1 text-lg`;

export default function NewPost() {
  const data = useActionData<ActionData>();

  const transition = useTransition();

  return transition.submission ? (
    <PostAdminIndex />
  ) : (
    <Form method="post">
      <p>
        <label>
          Post Title:{" "}
          {data?.errors.title ? (
            <em className="text-red-600">{data?.errors.title}</em>
          ) : null}
          <input
            type="text"
            name="title"
            className={inputClassName}
            defaultValue={data?.values.title || undefined}
          />
        </label>
      </p>
      <p>
        <label>
          Post Slug:{" "}
          {data?.errors.slug ? (
            <em className="text-red-600">{data?.errors.slug}</em>
          ) : null}
          <input
            type="text"
            name="slug"
            className={inputClassName}
            defaultValue={data?.values.slug || undefined}
          />
        </label>
      </p>
      <p>
        <label htmlFor="markdown">Markdown:</label>
        {data?.errors.markdown ? (
          <em className="text-red-600">{data?.errors.markdown}</em>
        ) : null}
        <br />
        <textarea
          id="markdown"
          rows={20}
          name="markdown"
          className={`${inputClassName} font-mono`}
          defaultValue={data?.values.markdown || undefined}
        />
      </p>
      <p className="text-right">
        <button
          type="submit"
          className="rounded bg-blue-500 py-2 px-4 text-white hover:bg-blue-600 focus:bg-blue-400 disabled:bg-blue-300"
        >
          Create Post
        </button>
      </p>
    </Form>
  );
}
