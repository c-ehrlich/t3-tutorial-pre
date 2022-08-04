import { z } from 'zod';

export const createPostSchema = z.object({ text: z.string().min(1) });
export type CreatePostInput = z.infer<typeof createPostSchema>;
