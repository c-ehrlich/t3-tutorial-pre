import { trpc } from '../../../utils/trpc';
import PostList from './PostList';

function PublicTimeline() {
  const {
    data: posts,
    isLoading,
    isError,
    error,
  } = trpc.proxy.post.getAll.useQuery();

  if (isError) return <div>{JSON.stringify(error)}</div>;

  if (isLoading) return <div>Loading Posts...</div>;

  if (posts) {
    return <PostList posts={posts} />;
  }

  return <div>Something else</div>;
}

export default PublicTimeline;
