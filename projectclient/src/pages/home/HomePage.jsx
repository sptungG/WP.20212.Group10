import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { ProductsFilter } from "src/common/constant";
import { isWishlisted } from "src/common/useToggleWishlist";
import ProductCard, { ProductCardLoading } from "src/components/card/ProductCard";
import ProductDrawerDetail from "src/components/card/ProductDrawerDetail";
import MainLayout from "src/layout/MainLayout";
import { useGetProductsFilteredQuery } from "src/stores/product/product.query";
import styled from "styled-components";
import lodash from "lodash";
import InfiniteScroll from "react-infinite-scroll-component";
import { Result } from "antd";
import { AiOutlineSmile } from "react-icons/ai";
import { Link } from "react-router-dom";
import { useAuth } from "src/common/useAuth";

const ProductsWrapper = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
  display: grid;
  grid-template-columns: repeat(auto-fill, 330px);
  justify-content: center;
  justify-items: center;
  align-items: start;
  grid-gap: 24px;
  @media screen and (max-width: 1023.98px) {
    grid-gap: 24px 0;
  }
`;

const HomePage = () => {
  const { user } = useAuth();
  const [productsFilterValue, setProductsFilterValue] = useState({ page: 1, limit: 4 });
  const {
    data: productsFilteredQuery,
    isFetching: productsFilteredFetching,
    isSuccess: productsFilteredSuccess,
  } = useGetProductsFilteredQuery(productsFilterValue);
  const [productsFiltered, setProductsFiltered] = useState([]);
  const [selectedProductId, setSelectedProductId] = useState(null);

  useEffect(() => {
    if (productsFilterValue.page === 1) {
      setProductsFiltered(productsFilteredQuery?.data || []);
    } else if (productsFilterValue.page <= productsFilteredQuery?.pagination.totalPage) {
      setProductsFiltered(
        lodash.uniqBy([...productsFiltered, ...(productsFilteredQuery?.data || [])], "_id")
      );
    }
  }, [
    productsFilterValue.page,
    productsFilteredQuery?.data,
    productsFilteredQuery?.pagination.totalPage,
  ]);

  return (
    <MainLayout>
      {productsFilteredSuccess && (
        <InfiniteScroll
          dataLength={productsFilteredQuery?.pagination.total}
          next={() =>
            setProductsFilterValue((prev) => ({
              ...prev,
              page: prev.page + 1,
            }))
          }
          hasMore={productsFilterValue.page < productsFilteredQuery?.pagination.totalPage}
          loader={
            <ProductsWrapper>
              {Array(4)
                .fill(null)
                .map((i, index) => (
                  <ProductCardLoading key={`ProductCardLoading_${index}`} />
                ))}
            </ProductsWrapper>
          }
          endMessage={
            <Result
              icon={<AiOutlineSmile size={48} />}
              title="Great, You have seen it all!"
              extra={<Link to={"/store"}>Start shopping now</Link>}
            />
          }
        >
          <ProductsWrapper>
            {productsFiltered.map((p) => (
              <ProductCard
                key={`ProductCard_${p._id}`}
                product={p}
                getSelectedProductId={(p) => setSelectedProductId(p)}
                isWishlisted={isWishlisted(p.wishlist, user?._id)}
              ></ProductCard>
            ))}
          </ProductsWrapper>
        </InfiniteScroll>
      )}
      {productsFilteredSuccess && (
        <ProductDrawerDetail
          productId={selectedProductId || null}
          setSelectedProduct={(value) => setSelectedProductId(value)}
        />
      )}
    </MainLayout>
  );
};

export default HomePage;
