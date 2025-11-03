import { useInfiniteQuery } from "@tanstack/react-query";
import api from '../app/fetchapi';

interface PaginatedResponse<T> {
  data: T[];
  totalCount: number;
}

export function usePaginatedQuery<T>(
  key: string,
  endpoint: string,
  limit = 10
) {
  return useInfiniteQuery<PaginatedResponse<T>>({
    queryKey: [key],
    initialPageParam: 0,
    queryFn: async ({ pageParam = 0 }) => {
      const res = await api.get(`${endpoint}?limit=${limit}&offset=${pageParam}`);
      return res.data;
    },
    getNextPageParam: (lastPage, pages) => {
      const totalCount = lastPage.totalCount;
      const loaded = pages.flatMap((p) => p.data).length;
      return loaded < totalCount ? loaded : undefined;
    },
  });
}
