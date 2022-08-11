import { useSession } from 'next-auth/react';
import Image from 'next/future/image';
import Link from 'next/link';
import { useState } from 'react';
import { INFINITE_QUERY_LIMIT } from '../../constants';
import { inferQueryOutput, trpc } from '../../utils/trpc';
import defaultAvatar from './default-avatar.jpeg';
import { Heart } from 'tabler-icons-react';
import { useEditPost, useLikePost, useUnlikePost } from './postHooks';

export type PostContext =
  | 'PUBLIC_TIMELINE'
  | 'USER_PROFILE'
  | 'FOLLOWING'
  | 'SEARCH';

export interface PostProps {
  post: inferQueryOutput<'post.getAll'>[number];
  context: PostContext;
}

function Post(props: PostProps) {
  const { data: session } = useSession();
  const [text, setText] = useState(props.post.text);
  const [isEditing, setIsEditing] = useState(false);
  const haveLiked =
    session?.user?.id && session.user.id === props.post.likedBy[0]?.id;

  const editPostMutation = useEditPost(props);
  const likePostMutation = useLikePost(props);
  const unlikePostMutation = useUnlikePost(props);

  function handleLikePost() {
    likePostMutation.mutate({ id: props.post.id });
  }

  function handleUnlikePost() {
    unlikePostMutation.mutate({ id: props.post.id });
  }

  function handleEditButtonEvent() {
    if (!isEditing) {
      setIsEditing(true);
    } else {
      editPostMutation.mutate({
        id: props.post.id,
        text,
      });
      setIsEditing(false);
    }
  }

  return (
    <div
      className='w-full max-w-[100vw] flex flex-row gap-2 p-2 bg-slate-200'
      key={props.post.id}
    >
      <Image
        className='rounded'
        src={props.post.author.image || defaultAvatar}
        alt={`${props.post.author.name}'s avatar`}
        width={64}
        height={64}
      />
      <div className='flex flex-col gap-2 w-full'>
        <div className='flex justify-between'>
          <div>
            <strong className='hover:underline'>
              <Link href={`/user/${props.post.userId}`}>
                <a>{props.post.author.name}</a>
              </Link>
            </strong>{' '}
            - {props.post.createdAt.toLocaleString()}
          </div>
          {session?.user?.id && session.user.id === props.post.userId && (
            <button onClick={handleEditButtonEvent}>
              {isEditing ? 'save' : 'edit'}
            </button>
          )}
          {session?.user?.id && session.user.id !== props.post.userId && (
            <button className='bg-none'>
              {haveLiked ? (
                <Heart color='red' fill='red' onClick={handleUnlikePost} />
              ) : (
                <Heart onClick={handleLikePost} />
              )}
            </button>
          )}
        </div>
        {isEditing ? (
          <input
            className='w-full border border-black p-1'
            value={text}
            onChange={(e) => setText(e.currentTarget.value)}
          />
        ) : (
          <p>{props.post.text}</p>
        )}
      </div>
    </div>
  );
}

export default Post;
