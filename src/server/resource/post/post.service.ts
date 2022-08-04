import { Context } from '../../trpc/context';
import { CreatePostInput } from './post.schema';

export async function createPost(ctx: Context, post: CreatePostInput) {
  if (!ctx.session?.user?.id) {
    console.log('---error creating post: no userid in createPost');
    throw new Error('Unauthorized');
  }

  console.log('--- found the userid in createPost');

  return ctx.prisma.post.create({
    data: {
      userId: ctx.session.user.id,
      text: post.text,
    },
  });
}
