import { DefaultErrorShape } from '@trpc/server';
import { useState } from 'react';
import { UseInfiniteQueryResult } from 'react-query';
import { INFINITE_QUERY_LIMIT } from '../constants';
import GetMorePostsButton from '../modules/post/GetMorePostsButton';
import PostList from '../modules/post/PostList';
import { inferQueryOutput, trpc } from '../utils/trpc';

function Search() {
  const [searchString, setSearchString] = useState('');

  // we could just add another constraint to GetPosts but lets do this instead...
  const searchQuery = trpc.proxy.post.paginatedSearch.useInfiniteQuery(
    { text: searchString, limit: INFINITE_QUERY_LIMIT },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
      enabled: false,
      keepPreviousData: true,
      onError: (err) => {
        console.log(err);
      },
      retry: (_failureCount, error) => {
        if (error.data.code === 'NOT_FOUND') {
          return false;
        }

        return true;
      },
    }
  );

  searchQuery.error?.data.code;

  function handleSearch() {
    searchQuery.refetch();
  }

  return (
    <div className='flex flex-col gap-2'>
      <div className='flex gap-2'>
        <input
          value={searchString}
          onChange={(e) => setSearchString(e.target.value)}
          className='border border-black px-2 py-1'
          placeholder='Enter something...'
        />
        <button
          className='border border-black px-2 py-1'
          onClick={handleSearch}
        >
          Search
        </button>
      </div>
      <div className='flex flex-col gap-2'>
        <SearchResult query={searchQuery} />
      </div>
    </div>
  );
}

export default Search;

function SearchResult(props: {
  query: UseInfiniteQueryResult<
    inferQueryOutput<'post.paginatedSearch'>,
    DefaultErrorShape
  >;
}) {
  if (props.query.isError && props.query.error.data.code === 'NOT_FOUND') {
    return <div>Nothing found...</div>;
  }

  if (props.query.isError) {
    return <div>Error: {JSON.stringify(props.query.error)}</div>;
  }

  if (props.query.isLoading) {
    return <div>Searching...</div>;
  }

  if (!props.query.isFetched) {
    return <div>Havent searched yet...</div>;
  }

  function nextPage() {
    props.query.fetchNextPage();
  }

  if (props.query.data) {
    const flattenedPosts = props.query.data.pages.map((p) => p.items).flat();

    return (
      <>
        <h2>Search results</h2>
        <PostList posts={flattenedPosts} context='SEARCH' />
        <GetMorePostsButton
          hasNextPage={props.query.hasNextPage}
          isFetchingNextPage={props.query.isFetchingNextPage}
          fetchNextPage={nextPage}
        />
      </>
    );
  }

  return (
    <div>Something went wrong...{JSON.stringify(props.query, null, 2)}</div>
  );
}
