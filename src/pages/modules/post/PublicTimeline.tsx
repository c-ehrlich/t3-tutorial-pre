import { trpc } from '../../../utils/trpc';
import PostList from './PostList';

function PublicTimeline() {
  const {
    data: posts,
    isLoading,
    isError,
    error,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } = trpc.proxy.post.getPaginated.useInfiniteQuery(
    { limit: 2 },
    { getNextPageParam: (lastPage) => lastPage.nextCursor }
  );

  if (isError) return <div>{JSON.stringify(error)}</div>;

  if (isLoading) return <div>Loading Posts...</div>;

  // TODO probably extract this to a component in the future
  if (posts) {
    const flattenedPosts = posts.pages.map((p) => p.items).flat();

    return (
      <>
        <PostList posts={flattenedPosts} />

        <button
          className={`border border-black p-2 bg-slate-200 ${
            hasNextPage && !isFetchingNextPage && 'hover:bg-slate-400'
          }`}
          onClick={() => fetchNextPage()}
          disabled={!hasNextPage || isFetchingNextPage}
        >
          {isFetchingNextPage
            ? 'Loading more...'
            : hasNextPage
            ? 'Load More'
            : 'Nothing more to load'}
        </button>
      </>
    );
  }

  return <div>Unexpected outcome in PublicTimeline</div>;
}

export default PublicTimeline;
