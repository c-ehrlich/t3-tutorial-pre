// src/server/trpc/router/index.ts
import { postRouter } from '../../resource/post/post.router';
import { t } from '../utils';
import { authRouter } from './auth';

export const appRouter = t.router({
  post: postRouter,
  auth: authRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
