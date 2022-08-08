import { INFINITE_QUERY_LIMIT } from '../../constants';
import { trpc } from '../../utils/trpc';
import GetMorePostsButton from './GetMorePostsButton';
import PostList from './PostList';

interface GetPostsProps {
  userId?: string;
  isFollowing?: boolean;
}

function GetPosts(props: GetPostsProps) {
  const {
    data: posts,
    isLoading,
    isError,
    error,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } = trpc.proxy.post.getPaginated.useInfiniteQuery(
    {
      limit: INFINITE_QUERY_LIMIT,
      ...(props.userId && { userId: props.userId }),
      ...(props.isFollowing && { isFollowing: true }),
    },
    { getNextPageParam: (lastPage) => lastPage.nextCursor }
  );

  if (isError) return <div>{JSON.stringify(error)}</div>;

  if (isLoading) return <div>Loading Posts...</div>;

  function nextPage() {
    fetchNextPage();
  }

  if (posts) {
    const flattenedPosts = posts.pages.map((p) => p.items).flat();

    return (
      <>
        <PostList
          posts={flattenedPosts}
          context={
            props.userId
              ? 'USER_PROFILE'
              : props.isFollowing
              ? 'FOLLOWING'
              : 'PUBLIC_TIMELINE'
          }
        />

        <GetMorePostsButton
          hasNextPage={hasNextPage}
          isFetchingNextPage={isFetchingNextPage}
          fetchNextPage={nextPage}
        />
      </>
    );
  }

  return <div>Unexpected outcome in PublicTimeline</div>;
}

export default GetPosts;
