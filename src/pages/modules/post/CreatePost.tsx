import { useSession } from 'next-auth/react';
import { useState } from 'react';
import { trpc } from '../../../utils/trpc';

function CreatePost() {
  const [text, setText] = useState('');
  const queryClient = trpc.useContext();
  const { data: session } = useSession();

  const createPostMutation = trpc.proxy.post.create.useMutation({
    onMutate: (post) => {
      const currentPosts = queryClient.getQueryData(['post.getAll']);

      if (currentPosts && session?.user) {
        const newPost = {
          createdAt: new Date(),
          id: 'temp',
          text: post.text,
          updatedAt: new Date(),
          userId: session.user.id,
          author: {
            name: session.user.name || 'unknown username',
            image: session.user.image || '',
          },
        };
        const updatedPosts = [newPost, ...currentPosts];
        queryClient.setQueryData(['post.getAll'], updatedPosts);
      }
    },
    onError: (e) => {
      console.error(e);
    },
    // fires both onError and onSuccess
    onSettled: () => {
      queryClient.invalidateQueries('post.getAll');
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
