import { inferQueryOutput } from '../../utils/trpc';
import Post, { PostContext } from './Post';

type PostListProps = {
  posts: inferQueryOutput<'post.getPaginated'>['items'];
  context: PostContext;
};

function PostList(props: PostListProps) {
  return (
    <div className='flex flex-col items-center gap-2 w-screen p-2'>
      {props.posts.map((post) => (
        <Post key={post.id} post={post} context={props.context} />
      ))}
    </div>
  );
}

export default PostList;
