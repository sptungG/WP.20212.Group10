import { createApi, fetchBaseQuery, retry } from "@reduxjs/toolkit/query/react";
import { bindParamsFilter } from "src/common/utils";
import { baseQueryWithReauth } from "../auth/auth.query";

// const baseQueryWithRetry = retry(baseQueryWithReauth, { maxRetries: 0 });

export const comboApi = createApi({
  reducerPath: "comboApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Combos"],
  endpoints: (builder) => ({
    getCombosFiltered: builder.query({
      query: (filter) => `/combos?${bindParamsFilter(filter)}`,
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ _id }) => ({ type: "Combos", id: _id })),
              { type: "Combos", id: "LIST" },
            ]
          : [{ type: "Combos", id: "LIST" }],
    }),
    getComboById: builder.query({
      query: (comboId) => `/combo/${comboId}`,
      providesTags: (result, error, id) => [{ type: "Combos", id }],
    }),
    requestCombo: builder.mutation({
      query: (initdata) => ({
        url: "/combo",
        method: "POST",
        body: initdata,
      }),
      invalidatesTags: ["Combos"],
    }),
    commentCombo: builder.mutation({
      query: ({ comboId, initdata }) => ({
        url: `/combo/${comboId}/comment`,
        method: "POST",
        body: initdata,
      }),
      invalidatesTags: (result, error, { comboId }) => [{ type: "Combos", id: comboId }],
    }),
    comboViewInc: builder.mutation({
      query: (comboId) => ({
        url: `/combo/${comboId}/view`,
        method: "PUT",
      }),
      invalidatesTags: (result, error, id) => [{ type: "Combos", id }],
    }),
    toggleComboWishlist: builder.mutation({
      query: ({ comboId }) => ({
        url: `/wishlist/product?comboId=${comboId}`,
        method: "PUT",
      }),
      invalidatesTags: (result, error, { comboId }) => [{ type: "Combos", id: comboId }],
    }),
    //
    uploadImage: builder.mutation({
      query: ({ onModel = "Combo", imageUrl, image }) => ({
        url: `/uploadimages?onModel=${onModel}`,
        method: "POST",
        body: { imageUrl, image },
      }),
      invalidatesTags: (result, error, { onModel }) => [{ type: "Combos", id: "LIST" }],
    }),
    removeImage: builder.mutation({
      query: ({ imageId }) => ({
        url: `/removeimage`,
        method: "DELETE",
        body: { imageId },
      }),
      invalidatesTags: (result, error, id) => [{ type: "Combos", id: "LIST" }],
    }),
    // ADMIN
    getAllCombosFiltered: builder.query({
      query: (filter) => `/admin/combos?${bindParamsFilter(filter)}`,
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ _id }) => ({ type: "Combos", id: _id })),
              { type: "Combos", id: "LIST" },
            ]
          : [{ type: "Combos", id: "LIST" }],
    }),
    // ADMIN
    createCombo: builder.mutation({
      query: (initdata) => ({
        url: `/admin/combo`,
        method: "POST",
        body: initdata,
      }),
      invalidatesTags: [{ type: "Combos", id: "LIST" }],
    }),
    // ADMIN
    updateCombo: builder.mutation({
      query: ({ comboId, initdata }) => ({
        url: `/admin/combo/${comboId}`,
        method: "PUT",
        body: initdata,
      }),
      invalidatesTags: (result, error, { comboId }) => [{ type: "Combos", id: comboId }],
    }),
    // ADMIN
    deleteCombo: builder.mutation({
      query: (comboId) => ({
        url: `/admin/combo/${comboId}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [{ type: "Combos", id }],
    }),
    //
    //
    // ADMIN
    getComboImagesFiltered: builder.query({
      query: (filter) => `/images?${bindParamsFilter(filter)}`,
      providesTags: [{ type: "Combos", id: "LIST" }],
    }),
    // ADMIN
    uploadAdminComboImage: builder.mutation({
      query: ({ onModel = "Combo", imageUrl, image }) => ({
        url: `/admin/uploadimages?onModel=${onModel}`,
        method: "POST",
        body: { imageUrl, image },
      }),
      invalidatesTags: (result, error, id) => [{ type: "Combos", id: "LIST" }],
    }),
    // ADMIN
    removeAdminComboImage: builder.mutation({
      query: ({ imageId }) => ({
        url: `/admin/removeimage`,
        method: "DELETE",
        body: { imageId },
      }),
      invalidatesTags: (result, error, id) => [{ type: "Combos", id: "LIST" }],
    }),
  }),
});
export const {
  useGetCombosFilteredQuery,
  useCommentComboMutation,
  useComboViewIncMutation,
  useCreateComboMutation,
  useDeleteComboMutation,
  useGetComboByIdQuery,
  useRequestComboMutation,
  useUpdateComboMutation,
  useGetAllCombosFilteredQuery,
  useToggleComboWishlistMutation,
  useGetComboImagesFilteredQuery,
  useUploadAdminComboImageMutation,
  useRemoveAdminComboImageMutation,
  useRemoveImageMutation,
  useUploadImageMutation,
} = comboApi;
