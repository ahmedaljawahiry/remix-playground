import { Form, useActionData, useTransition } from "@remix-run/react";
import { createPost } from "~/models/post.server";
import { json, redirect } from "@remix-run/node";
import PostAdminIndex from "~/routes/posts/admin/index";
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

export default function NewPost() {
  const data = useActionData<ActionData>();

  const transition = useTransition();

  return transition.submission ? (
    <PostAdminIndex />
  ) : (
    <Form method="post">
      <p>
        <LabelledInput
          name="title"
          defaultValue={data?.values.title}
          error={data?.errors.title}
        />
      </p>
      <p>
        <LabelledInput
          name="slug"
          defaultValue={data?.values.slug}
          error={data?.errors.slug}
        />
      </p>
      <p>
        <LabelledTextArea
          name="markdown"
          defaultValue={data?.values.markdown}
          error={data?.errors.markdown}
        />
      </p>
      <p className="text-right">
        <input type="hidden" name="action" value="create" />
        <SubmitButton text="Create" />
      </p>
    </Form>
  );
}
