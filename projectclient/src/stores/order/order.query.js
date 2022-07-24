import { createApi, fetchBaseQuery, retry } from "@reduxjs/toolkit/query/react";
import { bindParamsFilter } from "src/common/utils";
import { baseQueryWithReauth } from "../auth/auth.query";

// const baseQueryWithRetry = retry(baseQueryWithReauth, { maxRetries: 0 });

export const orderApi = createApi({
  reducerPath: "orderApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Orders"],
  endpoints: (builder) => ({
    getMyOrders: builder.query({
      query: (filter) => `/orders?${bindParamsFilter(filter)}`,
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ _id }) => ({ type: "Orders", id: _id })),
              { type: "Orders", id: "LIST" },
            ]
          : [{ type: "Orders", id: "LIST" }],
    }),
    createOrder: builder.mutation({
      query: (initdata) => ({
        url: "/order",
        method: "POST",
        body: initdata,
      }),
      invalidatesTags: [{ type: "Orders", id: "LIST" }],
    }),
    cancelMyOrder: builder.mutation({
      query: ({ orderId, initdata }) => ({
        url: `/order/cancel/${orderId}`,
        method: "POST",
        body: initdata,
      }),
      invalidatesTags: [{ type: "Orders", id: "LIST" }],
    }),
    createOrderCOD: builder.mutation({
      query: (initdata) => ({
        url: "/order/cod",
        method: "POST",
        body: initdata,
      }),
      invalidatesTags: [{ type: "Orders", id: "LIST" }],
    }),
    // ADMIN
    getAllOrders: builder.query({
      query: (filter) => `/admin/orders?${bindParamsFilter(filter)}`,
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ _id }) => ({ type: "Orders", id: _id })),
              { type: "Orders", id: "LIST" },
            ]
          : [{ type: "Orders", id: "LIST" }],
    }),
    // ADMIN
    getOrderById: builder.query({
      query: (orderId) => `/admin/order/${orderId}`,
      providesTags: (result, error, id) => [{ type: "Orders", id }],
    }),
    // ADMIN
    updateOrder: builder.mutation({
      query: ({ orderId, initdata }) => ({
        url: `/admin/order/${orderId}`,
        method: "PUT",
        body: initdata,
      }),
      invalidatesTags: (result, error, { orderId }) => [{ type: "Orders", id: orderId }],
    }),
    // ADMIN
    deleteOrder: builder.mutation({
      query: (orderId) => ({
        url: `/admin/order/${orderId}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [{ type: "Orders", id }],
    }),
  }),
});
export const {
  useCreateOrderCODMutation,
  useCreateOrderMutation,
  useDeleteOrderMutation,
  useGetAllOrdersQuery,
  useGetMyOrdersQuery,
  useGetOrderByIdQuery,
  useUpdateOrderMutation,
  useCancelMyOrderMutation,
} = orderApi;
