import { useSession } from 'next-auth/react';
import { useState } from 'react';
import { trpc } from '../../utils/trpc';

function CreatePost() {
  const [text, setText] = useState('');
  const queryClient = trpc.useContext();
  const { data: session } = useSession();

  const createPostMutation = trpc.proxy.post.create.useMutation({
    onMutate: (post) => {
      if (session?.user) {
        const date = new Date();

        const newPost = {
          id: JSON.stringify(date),
          userId: session.user.id,
          text: post.text,
          createdAt: date,
          updatedAt: date,
          author: {
            name: session.user.name || 'unknown username',
            image: session.user.image || '',
          },
        };

        queryClient.setInfiniteQueryData(
          ['post.getPaginated', { limit: 2, userId: session.user.id }],
          (data) => {
            if (!data) {
              return {
                pages: [],
                pageParams: [],
              };
            }

            if (data.pages[0]) {
              data.pages[0].items.unshift(newPost);
            }

            return data;
          }
        );
      }
    },
    onError: (e) => {
      console.error(e);
    },
    // fires both onError and onSuccess
    onSettled: () => {
      queryClient.invalidateQueries(['post.getPaginated']);
    },
  });

  function handleCreatePost() {
    createPostMutation.mutate({ text });
    setText('');
  }

  return (
    <div className='flex bg-green-100 p-2 justify-center'>
      <div className='flex gap-2 w-[600px]'>
        <textarea
          placeholder={`What's up?`}
          className='flex-1 border border-black p-2'
          value={text}
          onChange={(e) => setText(e.target.value)}
        ></textarea>
        <button
          className='border border-black p-2 bg-white'
          disabled={text.length < 1}
          onClick={handleCreatePost}
        >
          Post
        </button>
      </div>
    </div>
  );
}

export default CreatePost;
