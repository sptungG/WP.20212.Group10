import { createApi, fetchBaseQuery, retry } from "@reduxjs/toolkit/query/react";
import { bindParamsFilter } from "src/common/utils";
import { baseQueryWithReauth } from "../auth/auth.query";

// const baseQueryWithRetry = retry(baseQueryWithReauth, { maxRetries: 0 });

export const contentApi = createApi({
  reducerPath: "contentApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Contents", "Products", "Combos"],
  endpoints: (builder) => ({
    getAllContentsFiltered: builder.query({
      query: (filter) => `/contents?${bindParamsFilter(filter)}`,
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ _id }) => ({ type: "Contents", id: _id })),
              { type: "Contents", id: "LIST" },
            ]
          : [{ type: "Contents", id: "LIST" }],
    }),
    getContentByModelId: builder.query({
      query: (modelId) => `/content?modelId=${modelId}`,
      providesTags: (result, error, id) => [{ type: "Contents", id: result._id }],
    }),
    // ADMIN
    createContent: builder.mutation({
      query: (initdata) => ({
        url: "/admin/content",
        method: "POST",
        body: initdata,
      }),
      invalidatesTags: (result, error, { onModel, modelId }) => [
        { type: "Contents", id: "LIST" },
        onModel === "Product" && { type: "Products", id: modelId },
        onModel === "Combo" && { type: "Combos", id: modelId },
      ],
    }),
    // ADMIN
    updateContentById: builder.mutation({
      query: ({ contentId, initdata }) => ({
        url: `/admin/content?contentId=${contentId}`,
        method: "PUT",
        body: initdata,
      }),
      invalidatesTags: (result, error, { contentId }) => [
        { type: "Contents", id: contentId },
        result?.data.onModel === "Product" && { type: "Products", id: result?.data.modelId },
        result?.data.onModel === "Combo" && { type: "Combos", id: result?.data.modelId },
      ],
    }),
    // ADMIN
    removeContent: builder.mutation({
      query: (contentId) => ({
        url: `/admin/content?contentId=${contentId}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "Contents", id },
        result?.data.onModel === "Product" && { type: "Products", id: result?.data.modelId },
        result?.data.onModel === "Combo" && { type: "Combos", id: result?.data.modelId },
      ],
    }),
  }),
});
export const {
  useCreateContentMutation,
  useGetAllContentsFilteredQuery,
  useGetContentByModelIdQuery,
  useRemoveContentMutation,
  useUpdateContentByIdMutation,
} = contentApi;
