import { createApi, fetchBaseQuery, retry } from "@reduxjs/toolkit/query/react";
import { bindParamsFilter } from "src/common/utils";

const baseQuery = fetchBaseQuery({
  baseUrl: `https://api.unsplash.com/photos`,
});

const baseQueryWithRetry = retry(baseQuery, { maxRetries: 0 });

export const galleryApi = createApi({
  reducerPath: "galleryApi",
  baseQuery: baseQueryWithRetry,
  tagTypes: ["Gallery"],
  keepUnusedDataFor: 50,
  endpoints: (builder) => ({
    getGalleryPhotos: builder.query({
      query: (count) =>
        `/random?client_id=${process.env.REACT_APP_UNSPLASH_KEY}&orientation=landscape&query=setup%20desk&count=${count}`,
      providesTags: ["Gallery"],
      keepUnusedDataFor: 50,
    }),
  }),
});
export const { useGetGalleryPhotosQuery } = galleryApi;
