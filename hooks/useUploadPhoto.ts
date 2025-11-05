import { useMutation } from "@tanstack/react-query";
import api from "../app/fetchapi";

// ---- Types ---- //
export interface UploadPhotoParams {
  userId: number;
  file: {
    uri: string;
    name?: string;
    type?: string;
  };
  token: string;
}

export interface UploadPhotoResponse {
  resp_code: number;
  message: string;
}

export const useUploadPhoto = () => {
  return useMutation<UploadPhotoResponse, Error, UploadPhotoParams>({
    mutationFn: async ({ userId, file, token }) => {
      const formData = new FormData();
      formData.append("userId", userId.toString()); 

      formData.append("photo", {
        uri: file.uri,
        name: file.name ?? "photo.jpg",
        type: file.type ?? "image/jpeg",
      } as any); 

      const response = await api.post("/users/upload-photo", formData, {
  headers: {
  Accept: "application/json",
  "Content-Type": "multipart/form-data",
  // Authorization: `Bearer ${token}`, // enable later
}

});


      return response.data as UploadPhotoResponse;
    },
  });
};
