import { prisma } from "~/db.server";
import type { Post } from "@prisma/client";
export type { Post };

export async function getPosts() {
  return prisma.post.findMany();
}

export async function getPost(slug: string) {
  return prisma.post.findUnique({ where: { slug } });
}

export async function createPost(
  post: Pick<Post, "title" | "slug" | "markdown">
) {
  return prisma.post.create({ data: post });
}

export async function updatePost(
  post: Pick<Post, "title" | "slug" | "markdown">
) {
  return prisma.post.update({ data: post, where: { slug: post.slug } });
}
