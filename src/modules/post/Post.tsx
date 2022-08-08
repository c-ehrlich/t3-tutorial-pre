import { useSession } from 'next-auth/react';
import Image from 'next/future/image';
import Link from 'next/link';
import { useState } from 'react';
import { INFINITE_QUERY_LIMIT } from '../../constants';
import { inferQueryOutput, trpc } from '../../utils/trpc';
import defaultAvatar from './default-avatar.jpeg';

export type PostContext =
  | 'PUBLIC_TIMELINE'
  | 'USER_PROFILE'
  | 'FOLLOWING'
  | 'SEARCH';

interface PostProps {
  post: inferQueryOutput<'post.getAll'>[number];
  context: PostContext;
}

function Post(props: PostProps) {
  const { data: session } = useSession();
  const queryClient = trpc.useContext();
  const [text, setText] = useState(props.post.text);

  const [isEditing, setIsEditing] = useState(false);

  const editPostMutation = trpc.proxy.post.edit.useMutation({
    onMutate: (editedPost) => {
      const queryKeyRemainder = props.context === 'USER_PROFILE' &&
        session?.user?.id === props.post.userId && {
          userId: session.user.id,
        };

      const queryData = queryClient.getInfiniteQueryData([
        'post.getPaginated',
        {
          limit: INFINITE_QUERY_LIMIT,
          ...(queryKeyRemainder && queryKeyRemainder),
        },
      ]);

      if (queryData) {
        const optimisticUpdate: typeof queryData = {
          ...queryData,
          pages: queryData.pages.map((page) => ({
            ...page,
            items: page.items.map((item) => ({
              ...item,
              text: item.id === editedPost.id ? editedPost.text : item.text,
            })),
          })),
        };

        queryClient.setInfiniteQueryData(
          [
            'post.getPaginated',
            {
              limit: INFINITE_QUERY_LIMIT,
              ...(queryKeyRemainder && queryKeyRemainder),
            },
          ],
          optimisticUpdate
        );
      }
    },

    onError: (err) => {
      console.error(err);
    },

    onSettled: () => {
      queryClient.invalidateQueries(['post.getPaginated']);
    },
  });

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

  // edit post mutation

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
          {session?.user?.id === props.post.userId && (
            <button onClick={handleEditButtonEvent}>
              {isEditing ? 'save' : 'edit'}
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
