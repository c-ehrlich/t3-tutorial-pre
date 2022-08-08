import { DefaultErrorShape } from '@trpc/server';
import { useState } from 'react';
import { UseQueryResult } from 'react-query';
import PostList from '../modules/post/PostList';
import { inferQueryOutput, trpc } from '../utils/trpc';

function Search() {
  const [searchString, setSearchString] = useState('');

  const searchQuery = trpc.proxy.post.search.useQuery(
    { text: searchString },
    {
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
  query: UseQueryResult<inferQueryOutput<'post.search'>, DefaultErrorShape>;
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

  if (props.query.data) {
    return (
      <>
        <h2>Search results</h2>
        <PostList posts={props.query.data} context='SEARCH' />
      </>
    );
  }

  return (
    <div>Something went wrong...{JSON.stringify(props.query, null, 2)}</div>
  );
}
