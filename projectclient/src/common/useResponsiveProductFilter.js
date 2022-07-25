import { useEffect, useState } from "react";
import { useMediaQuery } from "react-responsive";
import { useGetProductsFilteredQuery } from "src/stores/product/product.query";
import { useDebounce } from "./useDebounce";

export function useResponsiveProductFilter() {
  const mediaAbove1390 = useMediaQuery({ minWidth: 1391 });
  const mediaAbove1040 = useMediaQuery({ minWidth: 1040 });
  const mediaAbove684 = useMediaQuery({ minWidth: 684 });
  const [productsFilterValue, setProductsFilterValue] = useState({ page: 1, limit: 4 });
  const debouncedProductsFilterValue = useDebounce(productsFilterValue, 500);
  const {
    data: productsFilteredQuery,
    isFetching: productsFilteredFetching,
    isSuccess: productsFilteredSuccess,
  } = useGetProductsFilteredQuery(debouncedProductsFilterValue);
  useEffect(() => {
    if (mediaAbove1390) {
      setProductsFilterValue({ page: 1, limit: 4 });
    } else if (mediaAbove1040) {
      setProductsFilterValue({ page: 1, limit: 3 });
    } else if (mediaAbove684) {
      setProductsFilterValue({ page: 1, limit: 2 });
    } else {
      setProductsFilterValue({ page: 1, limit: 1 });
    }
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, [mediaAbove1390, mediaAbove1040, mediaAbove684]);
  return {
    productsFilteredQuery,
    productsFilteredFetching,
    productsFilteredSuccess,
    productsFilterValue: debouncedProductsFilterValue,
    setProductsFilterValue,
  };
}
