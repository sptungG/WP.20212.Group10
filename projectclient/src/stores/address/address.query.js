import { createApi, fetchBaseQuery, retry } from "@reduxjs/toolkit/query/react";
import { bindParamsFilter } from "src/common/utils";
import { baseQueryWithReauth } from "../auth/auth.query";

// const baseQueryWithRetry = retry(baseQueryWithReauth, { maxRetries: 0 });

export const addressApi = createApi({
  reducerPath: "addressApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Addresses"],
  endpoints: (builder) => ({
    getMyAddressList: builder.query({
      query: () => `/user/address_list`,
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ _id }) => ({ type: "Addresses", id: _id })),
              { type: "Addresses", id: "LIST" },
            ]
          : [{ type: "Addresses", id: "LIST" }],
    }),
    getAddressByUserId: builder.query({
      query: (userId) => `/user/address_list/${userId}`,
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ _id }) => ({ type: "Addresses", id: _id })),
              { type: "Addresses", id: "LIST" },
            ]
          : [{ type: "Addresses", id: "LIST" }],
    }),
    addToMyAddressList: builder.mutation({
      query: (initdata) => ({
        url: `/user/address`,
        method: "POST",
        body: initdata,
      }),
      invalidatesTags: [{ type: "Addresses", id: "LIST" }],
    }),
    updateMyAddress: builder.mutation({
      query: ({ addressId, initdata }) => ({
        url: `/user/address`,
        method: "PUT",
        body: { addressId, ...initdata },
      }),
      invalidatesTags: (result, error, { addressId }) => [{ type: "Addresses", addressId }],
    }),
    removeAddressById: builder.mutation({
      query: ({ addressId, exchangeId }) => ({
        url: `/user/address`,
        method: "DELETE",
        body: { addressId, exchangeId },
      }),
      invalidatesTags: (result, error, { addressId }) => [{ type: "Addresses", addressId }],
    }),
  }),
});
export const {
  useAddToMyAddressListMutation,
  useGetMyAddressListQuery,
  useRemoveAddressByIdMutation,
  useUpdateMyAddressMutation,
  useGetAddressByUserIdQuery,
} = addressApi;
