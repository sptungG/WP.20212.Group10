import { createApi, fetchBaseQuery, retry } from "@reduxjs/toolkit/query/react";
import { bindParamsFilter } from "src/common/utils";
import { baseQueryWithReauth } from "../auth/auth.query";

// const baseQueryWithRetry = retry(baseQueryWithReauth, { maxRetries: 0 });

export const productApi = createApi({
  reducerPath: "productApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Products", "Images", "Variants"],
  endpoints: (builder) => ({
    getProductsFiltered: builder.query({
      query: (filter) => `/products?${bindParamsFilter(filter)}`,
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ _id }) => ({ type: "Products", id: _id })),
              { type: "Products", id: "LIST" },
            ]
          : [{ type: "Products", id: "LIST" }],
    }),
    getProduct: builder.query({
      query: (id) => `/product/${id}`,
      providesTags: (result, error, id) => [{ type: "Products", id }],
    }),
    productViewInc: builder.mutation({
      query: (id) => ({
        url: `/product/${id}/view`,
        method: "PUT",
      }),
      invalidatesTags: (result, error, id) => [{ type: "Products", id }],
    }),
    getProductsWishlistByUserId: builder.query({
      query: () => `/wishlist?onModel=Product`,
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ modelId }) => ({ type: "Products", id: modelId._id })),
              { type: "Products", id: "LIST" },
            ]
          : [{ type: "Products", id: "LIST" }],
    }),
    toggleProductWishlist: builder.mutation({
      query: ({ productId }) => ({
        url: `/wishlist/product?productId=${productId}`,
        method: "PUT",
      }),
      invalidatesTags: (result, error, { productId }) => [{ type: "Products", id: productId }],
    }),
    addProductToCart: builder.mutation({
      query: ({ productId, variantId, quantity }) => ({
        url: "/cart/product",
        method: "POST",
        body: { productId, variantId, quantity },
      }),
      invalidatesTags: (result, error, { productId }) => [{ type: "Products", id: productId }],
    }),
    removeProductFromCart: builder.mutation({
      query: ({ productId, variantId }) => ({
        url: `/cart/product`,
        method: "DELETE",
        body: { productId, variantId },
      }),
      invalidatesTags: (result, error, { productId }) => [{ type: "Products", id: productId }],
    }),
    // ADMIN
    getAllProductsFiltered: builder.query({
      query: (filter) => `/admin/products?${bindParamsFilter(filter)}`,
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ _id }) => ({ type: "Products", id: _id })),
              { type: "Products", id: "LIST" },
            ]
          : [{ type: "Products", id: "LIST" }],
    }),
    // ADMIN
    createProduct: builder.mutation({
      query: (initdata) => ({
        url: `/admin/product`,
        method: "POST",
        body: initdata,
      }),
      invalidatesTags: [{ type: "Products", id: "LIST" }],
    }),
    // ADMIN
    updateProduct: builder.mutation({
      query: ({ id, initdata }) => ({
        url: `/admin/product?productId=${id}`,
        method: "PUT",
        body: initdata,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Products", id }],
    }),
    // ADMIN
    deleteProduct: builder.mutation({
      query: (id) => ({
        url: `/admin/product?productId=${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [{ type: "Products", id }],
    }),
    //
    //
    // ADMIN
    createVariant: builder.mutation({
      query: ({ productId, initdata }) => ({
        url: `/admin/variant?productId=${productId}`,
        method: "POST",
        body: initdata,
      }),
      invalidatesTags: (result, error, { productId }) => [{ type: "Products", id: productId }],
    }),
    // ADMIN
    updateVariant: builder.mutation({
      query: ({ variantId, initdata }) => ({
        url: `/admin/variant?variantId=${variantId}`,
        method: "PUT",
        body: initdata,
      }),
      invalidatesTags: [{ type: "Products", id: "LIST" }],
    }),
    // ADMIN
    deleteVariant: builder.mutation({
      query: (variantId) => ({
        url: `/admin/variant?variantId=${variantId}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Products", id: "LIST" }],
    }),
  }),
});
export const {
  useGetProductsFilteredQuery,
  useCreateProductMutation,
  useDeleteProductMutation,
  useGetAllProductsFilteredQuery,
  useGetProductQuery,
  useProductViewIncMutation,
  useUpdateProductMutation,
  useToggleProductWishlistMutation,
  useCreateVariantMutation,
  useDeleteVariantMutation,
  useUpdateVariantMutation,
  useAddProductToCartMutation,
  useRemoveProductFromCartMutation,
  useGetProductsWishlistByUserIdQuery,
} = productApi;
