import { z } from 'zod';

const id = z.string().cuid();
const text = z.string().min(1);

export const createPostSchema = z.object({
  text,
});

export type CreatePostInput = z.infer<typeof createPostSchema>;

export const editPostSchema = z.object({
  id,
  text,
});

export const searchPostSchema = z.object({
  text,
});

export const likePostSchema = z.object({
  id,
});
