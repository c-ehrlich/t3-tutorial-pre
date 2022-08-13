export function getNextCursor<
  QueryResult extends { id: string },
  CursorOptions extends {
    cursor?: string | null | undefined;
    limit?: number | null | undefined;
  }
>({ items, input }: { items: QueryResult[]; input: CursorOptions }) {
  let nextCursor: typeof input.cursor = null;

  if (items.length > 0 && items.length > (input.limit ?? 20)) {
    const nextItem = items.pop() as QueryResult;
    nextCursor = nextItem.id;
  }

  return nextCursor;
}
