import { createApi, fetchBaseQuery, retry } from "@reduxjs/toolkit/query/react";
import { bindParamsFilter } from "src/common/utils";
import { baseQueryWithReauth, baseQuery } from "../auth/auth.query";

export const imageApi = createApi({
  reducerPath: "imageApi",
  baseQuery: baseQuery,
  tagTypes: ["Products", "Images", "Combos"],
  endpoints: (builder) => ({
    // ADMIN
    getImagesFiltered: builder.query({
      query: (filter) => `/images?${bindParamsFilter(filter)}`,
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ _id }) => ({ type: "Images", id: _id })),
              { type: "Images", id: "LIST" },
            ]
          : [{ type: "Images", id: "LIST" }],
    }),
    // ADMIN
    uploadAdminImage: builder.mutation({
      query: ({ onModel = "Product", imageUrl = "", image = "" }) => ({
        url: `/admin/uploadimages?onModel=${onModel}`,
        method: "POST",
        body: { imageUrl, image },
      }),
      invalidatesTags: (result, error, id) => [{ type: "Images", id: "LIST" }],
    }),
    // ADMIN
    removeAdminImage: builder.mutation({
      query: ({ imageId }) => ({
        url: `/admin/removeimage`,
        method: "DELETE",
        body: { imageId },
      }),
      invalidatesTags: (result, error, { imageId }) => [{ type: "Images", id: imageId }],
    }),
  }),
});
export const {
  useUploadAdminImageMutation,
  useRemoveAdminImageMutation,
  useGetImagesFilteredQuery,
} = imageApi;
