import Image from 'next/future/image';
import { inferQueryOutput } from '../../../utils/trpc';
import defaultAvatar from './default-avatar.jpeg';

type PostListProps = {
  posts: inferQueryOutput<'post.getAll'>;
};

function PostList(props: PostListProps) {
  return (
    <div className='flex flex-col items-center gap-2 w-screen p-2'>
      {props.posts.map((post) => (
        <div
          className='w-full max-w-[100vw] flex flex-row gap-2 p-2 bg-slate-200'
          key={post.id}
        >
          <Image
            className='rounded'
            src={post.author.image || defaultAvatar}
            alt={`${post.author.name}'s avatar`}
            width={64}
            height={64}
          />
          <div className='flex flex-col gap-2'>
            <div>
              <strong>{post.author.name}</strong> -{' '}
              {post.createdAt.toLocaleString()}
            </div>
            <p>{post.text}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default PostList;
