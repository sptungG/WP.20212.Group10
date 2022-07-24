import { createApi, fetchBaseQuery, retry } from "@reduxjs/toolkit/query/react";
import { bindParamsFilter } from "src/common/utils";
import { baseQueryWithReauth } from "../auth/auth.query";

// const baseQueryWithRetry = retry(baseQueryWithReauth, { maxRetries: 0 });

export const categoryApi = createApi({
  reducerPath: "categoryApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Categories"],
  endpoints: (builder) => ({
    getAllCategoriesFiltered: builder.query({
      query: (filter) => `/categories?${bindParamsFilter(filter)}`,
      providesTags: (result) =>
        // is result available?
        result
          ? // successful query
            [
              ...result.data.map(({ _id }) => ({ type: "Categories", id: _id })),
              { type: "Categories", id: "LIST" },
            ]
          : // an error occurred, but we still want to refetch this query when `{ type: 'Categories', id: 'LIST' }` is invalidated
            [{ type: "Categories", id: "LIST" }],
    }),
    getCategory: builder.query({
      query: (id) => `/category/${id}`,
      providesTags: (result, error, id) => [{ type: "Categories", id }],
    }),
    // ADMIN
    createCategory: builder.mutation({
      query: (initdata) => ({
        url: "/admin/category",
        method: "POST",
        body: initdata,
      }),
      // Invalidates all Category-type queries providing the `LIST` id - after all, depending of the sort order,
      // that newly created post could show up in any lists.
      invalidatesTags: [{ type: "Categories", id: "LIST" }],
    }),
    // ADMIN
    updateCategory: builder.mutation({
      query: ({ id, initdata }) => ({
        url: `/admin/category/${id}`,
        method: "PUT",
        body: initdata,
      }),
      // Invalidates all queries that subscribe to this Category `id` only.
      // In this case, `getCategory` will be re-run. `getCategories` *might*  rerun, if this id was under its results.
      invalidatesTags: (result, error, { id }) => [{ type: "Categories", id }],
    }),
    // ADMIN
    deleteCategory: builder.mutation({
      query: (id) => ({
        url: `/admin/category/${id}`,
        method: "DELETE",
      }),
      // Invalidates all queries that subscribe to this Category `id` only.
      invalidatesTags: (result, error, id) => [{ type: "Categories", id }],
    }),
  }),
});
export const {
  useGetAllCategoriesFilteredQuery,
  useCreateCategoryMutation,
  useGetCategoryQuery,
  useDeleteCategoryMutation,
  useUpdateCategoryMutation,
} = categoryApi;
