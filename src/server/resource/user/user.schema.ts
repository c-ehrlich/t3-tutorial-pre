import { z } from 'zod';

export const findUserSchema = z.object({
  id: z.string().cuid(),
});
