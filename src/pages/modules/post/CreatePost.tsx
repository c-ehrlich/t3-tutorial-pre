import React, { useState } from 'react';
import { trpc } from '../../../utils/trpc';

function CreatePost() {
  const [text, setText] = useState('');
  const createPostMutation = trpc.proxy.post.create.useMutation();

  function handleCreatePost() {
    createPostMutation.mutate({ text });
    setText('');
  }

  return (
    <div className='bg-green-100 p-2 flex gap-2'>
      <input
        className='border border-black p-2'
        value={text}
        onChange={(e) => setText(e.target.value)}
      ></input>
      <button
        className='border border-black p-2 bg-white'
        disabled={text.length < 1}
        onClick={handleCreatePost}
      >
        Post
      </button>
    </div>
  );
}

export default CreatePost;
