import { trpc } from '../../../utils/trpc';
import PostList from './PostList';

function PublicTimeline() {
  const { data, isLoading, isError, error } = trpc.proxy.post.getAll.useQuery();

  if (isError) return <div>{JSON.stringify(error)}</div>;

  if (isLoading) return <div>Loading Posts...</div>;

  if (data) {
    return <PostList posts={data.posts} />;
  }

  return <div>Something else</div>;
}

export default PublicTimeline;
