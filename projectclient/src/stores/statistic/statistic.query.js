import { createApi, fetchBaseQuery, retry } from "@reduxjs/toolkit/query/react";
import { bindParamsFilter } from "src/common/utils";
import { baseQueryWithReauth } from "../auth/auth.query";

// const baseQueryWithRetry = retry(baseQueryWithReauth, { maxRetries: 0 });

export const statisticApi = createApi({
  reducerPath: "statisticApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Statistics"],
  endpoints: (builder) => ({
    getUsersStats: builder.query({
      query: ({ begin, end }) => `/stats/users?${bindParamsFilter({ begin, end })}`,
      providesTags: ["Statistics"],
      keepUnusedDataFor: 1,
    }),
    getVariantsStats: builder.query({
      query: ({ begin, end, orderStatus }) =>
        `/stats/variants?${bindParamsFilter({ begin, end, orderStatus })}`,
      providesTags: ["Statistics"],
    }),
    getIncomeStats: builder.query({
      query: ({ productId, begin, end, orderStatus }) =>
        `/stats/income?${bindParamsFilter({ productId, begin, end, orderStatus })}`,
      providesTags: ["Statistics"],
      keepUnusedDataFor: 1,
    }),
    getStatusStats: builder.query({
      query: ({ productId, begin, end, orderStatus }) =>
        `/stats/statuses?${bindParamsFilter({ productId, begin, end, orderStatus })}`,
      providesTags: ["Statistics"],
      keepUnusedDataFor: 1,
    }),
  }),
});
export const {
  useGetIncomeStatsQuery,
  useGetUsersStatsQuery,
  useGetVariantsStatsQuery,
  useGetStatusStatsQuery,
} = statisticApi;
