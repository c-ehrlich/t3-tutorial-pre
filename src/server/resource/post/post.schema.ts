import { z } from 'zod';

export const createPostSchema = z.object({ text: z.string().min(1) });
export type CreatePostInput = z.infer<typeof createPostSchema>;

export const editPostSchema = z.object({
  id: z.string().cuid(),
  text: z.string().min(1),
});

export const searchPostSchema = z.object({
  text: z.string().min(1),
});
