import { createApi, fetchBaseQuery, retry } from "@reduxjs/toolkit/query/react";
import { bindParamsFilter } from "src/common/utils";

const baseQuery = fetchBaseQuery({
  baseUrl: `https://securetoken.googleapis.com/v1`,
});

const baseQueryWithRetry = retry(baseQuery, { maxRetries: 0 });

export const refreshAuthApi = createApi({
  reducerPath: "refreshAuthApi",
  baseQuery: baseQueryWithRetry,
  tagTypes: ["RefreshAuth"],
  endpoints: (builder) => ({
    exchangeAuthToken: builder.mutation({
      query: (refreshToken) => ({
        url: `/token?key=${process.env.REACT_APP_FIREBASE_API_KEY}`,
        method: "POST",
        body: {
          grant_type: "refresh_token",
          refresh_token: refreshToken,
        },
        headers: {
          "Content-Type": "application/json",
        },
      }),
      invalidatesTags: ["RefreshAuth"],
      extraOptions: { maxRetries: 1 },
    }),
  }),
});
export const { useExchangeAuthTokenMutation } = refreshAuthApi;
