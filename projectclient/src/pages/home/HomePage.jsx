import { Result } from "antd";
import lodash from "lodash";
import { useEffect, useState } from "react";
import { AiOutlineSmile } from "react-icons/ai";
import { BsArrowDown } from "react-icons/bs";
import InfiniteScroll from "react-infinite-scroll-component";
import { Link } from "react-router-dom";
import { useAuth } from "src/common/useAuth";
import { useResponsiveProductFilter } from "src/common/useResponsiveProductFilter";
import { isWishlisted } from "src/common/useToggleWishlist";
import AnimatedButton from "src/components/button/AnimatedButton";
import Button from "src/components/button/Button";
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
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, [productsFilterValue.limit]);

  useEffect(() => {
    if (productsFilterValue.page === 1) {
      setProductsFiltered(productsFilteredQuery?.data || []);
    } else if (productsFilterValue.page <= productsFilteredQuery?.pagination.totalPage) {
      setProductsFiltered(
        lodash.uniqBy([...productsFiltered, ...(productsFilteredQuery?.data || [])], "_id")
      );
    }
  }, [
    productsFilterValue.limit,
    productsFilterValue.page,
    productsFilteredQuery?.data,
    productsFilteredQuery?.pagination.totalPage,
  ]);

  return (
    <MainLayout>
      <HomeWrapper>
        {productsFilteredSuccess && (
          <InfiniteScroll
            dataLength={productsFilteredQuery?.pagination.total}
            next={() =>
              setProductsFilterValue((prev) => ({
                ...prev,
                page: prev.page + 1,
              }))
            }
            scrollThreshold="4px"
            hasMore={productsFilterValue.page < productsFilteredQuery?.pagination.totalPage}
            loader={
              <ProductsContainer>
                {Array(productsFilterValue.limit)
                  .fill(null)
                  .map((i, index) => (
                    <ProductCardLoading key={`ProductCardLoading_${index}`} />
                  ))}
                <div className="actions">
                  <Button
                    onClick={() =>
                      setProductsFilterValue((prev) => ({
                        ...prev,
                        page: prev.page + 1,
                      }))
                    }
                    size="large"
                    shape="round"
                    icon={<BsArrowDown />}
                  >
                    Xem thêm ngay
                  </Button>
                </div>
              </ProductsContainer>
            }
            endMessage={
              <Result
                icon={<AiOutlineSmile size={48} />}
                title="Bạn đã lướt hết sản phẩm rồi!"
                extra={
                  <Link to={"/store"} style={{ display: "flex", justifyContent: "center" }}>
                    <AnimatedButton>Bắt đầu mua hàng thôi</AnimatedButton>
                  </Link>
                }
              />
            }
          >
            <ProductsContainer>
              {productsFiltered.map((p) => (
                <ProductCard
                  key={`ProductCard_${p._id}`}
                  product={p}
                  getSelectedProductId={(p) => setSelectedProductId(p)}
                  isWishlisted={isWishlisted(p.wishlist, user?._id)}
                ></ProductCard>
              ))}
            </ProductsContainer>
          </InfiniteScroll>
        )}
        {productsFilteredSuccess && (
          <ProductDrawerDetail
            productId={selectedProductId || null}
            setSelectedProduct={(value) => setSelectedProductId(value)}
          />
        )}
      </HomeWrapper>
    </MainLayout>
  );
};

const HomeWrapper = styled.div`
`;

const ProductsContainer = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
  display: grid;
  position: relative;
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
  & > .actions {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
`;

export default HomePage;
