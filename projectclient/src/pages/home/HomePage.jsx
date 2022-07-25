import { Result } from "antd";
import lodash from "lodash";
import { useEffect, useState } from "react";
import { AiOutlineSmile } from "react-icons/ai";
import InfiniteScroll from "react-infinite-scroll-component";
import { Link } from "react-router-dom";
import { useAuth } from "src/common/useAuth";
import { useResponsiveProductFilter } from "src/common/useResponsiveProductFilter";
import { isWishlisted } from "src/common/useToggleWishlist";
import ProductCard, { ProductCardLoading } from "src/components/card/ProductCard";
import ProductDrawerDetail from "src/components/card/ProductDrawerDetail";
import MainLayout from "src/layout/MainLayout";
import styled from "styled-components";

const HomePage = () => {
  const { user } = useAuth();
  const {
    productsFilterValue,
    setProductsFilterValue,
    productsFilteredQuery,
    productsFilteredFetching,
    productsFilteredSuccess,
  } = useResponsiveProductFilter();

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
              {Array(productsFilterValue.limit)
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
  @media screen and (min-width: 1440px) {
    grid-template-columns: repeat(4, 330px);
  }
  @media screen and (max-width: 1023.98px) {
    grid-gap: 24px;
  }
`;

export default HomePage;
