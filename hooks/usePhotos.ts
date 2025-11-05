import { useInfiniteQuery } from "@tanstack/react-query";
import api from "../app/fetchapi";

interface Photo {
  id: number;
  image: string;
}

interface PhotosResponse {
  data: Photo[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export const usePhotos = () => {
  return useInfiniteQuery<PhotosResponse>({
    queryKey: ["photos"],
    initialPageParam: 1,
    queryFn: async ({ pageParam }) => {
      const res = await api.post("/users/photos", {
        page: pageParam,
        limit: 6,
      });
      return res.data;
    },
    getNextPageParam: (lastPage) => {
      if (lastPage.pagination.page < lastPage.pagination.totalPages) {
        return lastPage.pagination.page + 1;
      }
      return undefined;
    },
  });
};
