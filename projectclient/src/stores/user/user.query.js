import { createApi, fetchBaseQuery, retry } from "@reduxjs/toolkit/query/react";
import { bindParamsFilter } from "src/common/utils";
import { baseQueryWithReauth } from "../auth/auth.query";

// const baseQueryWithRetry = retry(baseQueryWithReauth, { maxRetries: 0 });

export const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Users"],
  endpoints: (builder) => ({
    updateMyInfo: builder.mutation({
      query: (initdata) => ({
        url: `/user`,
        method: "PUT",
        body: initdata,
      }),
      invalidatesTags: [{ type: "Users", id: "LIST" }],
    }),
    getMyWishlist: builder.query({
      query: ({ userId, onModel }) => `/wishlist?${bindParamsFilter({ userId, onModel })}`,
      providesTags: [{ type: "Users", id: "LIST" }],
    }),
    getMyCart: builder.query({
      query: () => `/cart/products`,
      providesTags: [{ type: "Users", id: "LIST" }],
    }),
    // ADMIN
    getFilteredUsers: builder.query({
      query: (filter) => `/admin/users?${bindParamsFilter(filter)}`,
      providesTags: [{ type: "Users", id: "LIST" }],
    }),
    // ADMIN
    getUserById: builder.query({
      query: (userId) => `/admin/user/${userId}`,
      providesTags: [{ type: "Users", id: "LIST" }],
    }),
    // ADMIN
    updateUser: builder.mutation({
      query: (data) => ({
        url: `/admin/user/${data.userId}`,
        method: "PUT",
        body: data.initdata,
      }),
      invalidatesTags: [{ type: "Users", id: "LIST" }],
    }),
    // ADMIN
    removeUser: builder.mutation({
      query: (userId) => ({
        url: `/admin/user/${userId}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Users", id: "LIST" }],
    }),
  }),
});
export const {
  useUpdateMyInfoMutation,
  useGetFilteredUsersQuery,
  useGetUserByIdQuery,
  useUpdateUserMutation,
  useRemoveUserMutation,
  useGetMyWishlistQuery,
  useGetMyCartQuery,
} = userApi;
