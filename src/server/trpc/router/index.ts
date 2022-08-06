import { t } from '../utils';
import { postRouter } from '../../resource/post/post.router';
import { userRouter } from '../../resource/user/user.router';
import { authRouter } from './auth';

export const appRouter = t.router({
  post: postRouter,
  auth: authRouter,
  user: userRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
