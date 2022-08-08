import { Post } from '@prisma/client';
import { DefaultErrorShape } from '@trpc/server';
import { FetchNextPageOptions, InfiniteQueryObserverResult } from 'react-query';

type GetMorePostsButtonProps = {
  hasNextPage: boolean | undefined;
  isFetchingNextPage: boolean;
  fetchNextPage: () => void;
};

export default function GetMorePostsButton(props: GetMorePostsButtonProps) {
  return (
    <button
      className={`border border-black p-2 bg-slate-200 ${
        props.hasNextPage && !props.isFetchingNextPage && 'hover:bg-slate-400'
      }`}
      onClick={() => props.fetchNextPage()}
      disabled={!props.hasNextPage || props.isFetchingNextPage}
    >
      {props.isFetchingNextPage
        ? 'Loading more...'
        : props.hasNextPage
        ? 'Load More'
        : 'Nothing more to load'}
    </button>
  );
}
