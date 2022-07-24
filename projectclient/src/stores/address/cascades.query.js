import { createApi, fetchBaseQuery, retry } from "@reduxjs/toolkit/query/react";
import { bindParamsFilter } from "src/common/utils";

const baseQuery = fetchBaseQuery({
  baseUrl: `https://provinces.open-api.vn/api`,
});

const baseQueryWithRetry = retry(baseQuery, { maxRetries: 0 });

export const cascadesApi = createApi({
  reducerPath: "cascadesApi",
  baseQuery: baseQueryWithRetry,
  tagTypes: ["Provinces"],
  keepUnusedDataFor: 50,
  endpoints: (builder) => ({
    getProvinces: builder.query({
      query: () => `/p`,
      providesTags: ["Provinces"],
      transformResponse: (response, meta, arg) => response.data,
    }),
    getAllProvincesDistricts: builder.query({
      query: (pcode) => `/?depth=2`,
      providesTags: ["Provinces"],
    }),
    getProvinceDistricts: builder.query({
      query: (pcode) => `/p/${pcode}?depth=2`,
      providesTags: ["Provinces"],
    }),
  }),
});
export const {
  useGetProvincesQuery,
  useGetProvinceDistrictsQuery,
  useGetAllProvincesDistrictsQuery,
} = cascadesApi;
