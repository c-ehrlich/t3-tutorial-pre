import { z } from 'zod';

export const findUserSchema = z.object({
  id: z.string().cuid(),
});

export const followUserSchema = z.object({
  id: z.string().cuid(),
});
