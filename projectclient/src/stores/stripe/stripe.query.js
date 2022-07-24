import { createApi, fetchBaseQuery, retry } from "@reduxjs/toolkit/query/react";
import { bindParamsFilter } from "src/common/utils";
import { baseQueryWithReauth } from "../auth/auth.query";

// const baseQueryWithRetry = retry(baseQueryWithReauth, { maxRetries: 0 });

export const stripeApi = createApi({
  reducerPath: "stripeApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["PaymentIntent"],
  endpoints: (builder) => ({
    createPaymentIntent: builder.mutation({
      query: (data) => ({
        url: `/create-payment-intent`,
        method: "POST",
      }),
      invalidatesTags: [{ type: "PaymentIntent" }],
    }),
    refundPayment: builder.mutation({
      query: (orderId) => ({
        url: `/refund/${orderId}`,
        method: "POST",
      }),
      invalidatesTags: [{ type: "PaymentIntent" }],
    }),
  }),
});
export const { useCreatePaymentIntentMutation, useRefundPaymentMutation } = stripeApi;
