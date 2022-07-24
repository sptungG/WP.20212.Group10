import { createApi, fetchBaseQuery, retry } from "@reduxjs/toolkit/query/react";
import { bindParamsFilter } from "src/common/utils";
import { baseQueryWithReauth } from "../auth/auth.query";

// const baseQueryWithRetry = retry(baseQueryWithReauth, { maxRetries: 0 });

export const reviewApi = createApi({
  reducerPath: "reviewApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Reviews", "Products"],
  endpoints: (builder) => ({
    getReviewsFiltered: builder.query({
      query: (filter) => `/reviews?${bindParamsFilter(filter)}`,
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ _id }) => ({ type: "Reviews", id: _id })),
              { type: "Reviews", id: "LIST" },
            ]
          : [{ type: "Reviews", id: "LIST" }],
    }),
    getReviewsByProduct: builder.query({
      query: ({ productId, filter }) => `/product/${productId}/reviews?${bindParamsFilter(filter)}`,
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ _id }) => ({ type: "Reviews", id: _id })),
              { type: "Reviews", id: "LIST" },
            ]
          : [{ type: "Reviews", id: "LIST" }],
    }),
    getReviewsByCombo: builder.query({
      query: (comboId, filter) => `/combo/${comboId}/reviews?${bindParamsFilter(filter)}`,
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ _id }) => ({ type: "Reviews", id: _id })),
              { type: "Reviews", id: "LIST" },
            ]
          : [{ type: "Reviews", id: "LIST" }],
    }),
    createReview: builder.mutation({
      query: ({ productId, initdata }) => ({
        url: `/review?${bindParamsFilter({ productId })}`,
        method: "POST",
        body: initdata,
      }),
      invalidatesTags: (result, error, { productId }) => [
        { type: "Reviews", id: "LIST" },
        { type: "Products", id: productId },
      ],
    }),
    // ADMIN
    getAllReviewsFiltered: builder.query({
      query: (filter) => `/admin/reviews?${bindParamsFilter(filter)}`,
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ _id }) => ({ type: "Reviews", id: _id })),
              { type: "Reviews", id: "LIST" },
            ]
          : [{ type: "Reviews", id: "LIST" }],
    }),
    // ADMIN
    deleteReview: builder.mutation({
      query: (reviewId) => ({
        url: `/admin/review?reviewId=${reviewId}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) =>
        result
          ? [
              { type: "Products", id: result.data.modelId },
              { type: "Reviews", id },
            ]
          : [
              { type: "Products", id: "LIST" },
              { type: "Reviews", id: "LIST" },
            ],
    }),
  }),
});
export const {
  useCreateReviewMutation,
  useDeleteReviewMutation,
  useGetReviewsByComboQuery,
  useGetReviewsByProductQuery,
  useGetReviewsFilteredQuery,
  useGetAllReviewsFilteredQuery,
} = reviewApi;
