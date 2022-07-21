import { Form, useActionData, useTransition } from "@remix-run/react";
import { createPost } from "~/models/post.server";
import { json, redirect } from "@remix-run/node";

type Request = {
  request: { formData: () => Promise<FormData> };
};

type Errors =
  | {
      title: string | null;
      slug: string | null;
      markdown: string | null;
    }
  | undefined;

export async function action({ request }: Request) {
  const data = await request.formData();

  const title = data.get("title");
  const slug = data.get("slug");
  const markdown = data.get("markdown");

  let response;

  if (title && slug && markdown) {
    await createPost({
      title: title.toString(),
      slug: slug.toString(),
      markdown: markdown.toString(),
    });
    response = redirect("/posts/admin");
  } else {
    const errors: Errors = {
      title: title ? null : "Title is required",
      slug: slug ? null : "Slug is required",
      markdown: markdown ? null : "Markdown is required",
    };
    response = json(errors);
  }

  return response;
}

export default function NewPost() {
  const errors = useActionData<Errors>();

  const transition = useTransition();
  const isCreating = Boolean(transition.submission);

  const inputClassName = `w-full rounded border border-gray-500 px-2 py-1 text-lg`;

  return (
    <Form method="post">
      <p>
        <label>
          Post Title:{" "}
          {errors?.title ? (
            <em className="text-red-600">{errors.title}</em>
          ) : null}
          <input type="text" name="title" className={inputClassName} />
        </label>
      </p>
      <p>
        <label>
          Post Slug:{" "}
          {errors?.slug ? (
            <em className="text-red-600">{errors.slug}</em>
          ) : null}
          <input type="text" name="slug" className={inputClassName} />
        </label>
      </p>
      <p>
        <label htmlFor="markdown">Markdown:</label>
        {errors?.markdown ? (
          <em className="text-red-600">{errors.markdown}</em>
        ) : null}
        <br />
        <textarea
          id="markdown"
          rows={20}
          name="markdown"
          className={`${inputClassName} font-mono`}
        />
      </p>
      <p className="text-right">
        <button
          type="submit"
          disabled={isCreating}
          className="rounded bg-blue-500 py-2 px-4 text-white hover:bg-blue-600 focus:bg-blue-400 disabled:bg-blue-300"
        >
          {isCreating ? "Creating..." : "Create Post"}
        </button>
      </p>
    </Form>
  );
}
