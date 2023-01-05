import { useEffect } from "react";
import {
  useAddProductToCartMutation,
  useRemoveProductFromCartMutation,
} from "src/stores/product/product.query";
import { useGetMyCartQuery } from "src/stores/user/user.query";
import { useAuth } from "./useAuth";

export function useAddToCart() {
  const { isSignedIn } = useAuth();
  const [
    addProductToCart,
    { isLoading: addProductToCartLoading, isSuccess: addProductToCartSuccess },
  ] = useAddProductToCartMutation();
  const [
    removeProductFromCart,
    { isLoading: removeProductFromCartLoading, isSuccess: removeProductFromCartSuccess },
  ] = useRemoveProductFromCartMutation();
  const {
    data: myCartQuery,
    isSuccess: myCartQuerySuccess,
    refetch: myCartRefetch,
  } = useGetMyCartQuery(
    {},
    {
      skip: !isSignedIn,
      pollingInterval: 600,
      refetchOnMountOrArgChange: true,
      refetchOnFocus: true,
    }
  );

  // console.log("useAddToCart ~ cart", cart);

  return {
    cart: myCartQuerySuccess ? myCartQuery.data : null,
    addProductToCart,
    removeProductFromCart,
    addProductToCartSuccess,
    removeProductFromCartSuccess,
    myCartRefetch,
  };
}
