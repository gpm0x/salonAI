export interface PaginationParams {
  cursor?: string
  limit: number
}

export interface PaginatedResult<T> {
  data: T[]
  nextCursor: string | null
  total: number
}

export function parsePagination(query: { cursor?: string; limit?: string }): PaginationParams {
  return {
    cursor: query.cursor,
    limit: Math.min(Number(query.limit) || 20, 100),
  }
}
