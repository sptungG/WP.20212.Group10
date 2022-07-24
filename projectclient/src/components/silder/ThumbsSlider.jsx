import React, { useEffect, useState } from "react";
import { NOT_FOUND_IMG } from "src/common/constant";
import { Navigation, Thumbs } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import styled from "styled-components";
import { rgba } from "polished";

const ThumbsSlider = ({
  images = [],
  direction = "x",
  actions = null,
  slideHeight = 240,
  thumbSize = 52,
}) => {
  const [activeThumb, setActiveThumb] = useState();
  useEffect(() => {
    return () => {
      setActiveThumb();
    };
  }, []);

  return (
    <SliderWrapper direction={direction} slideHeight={slideHeight} thumbSize={thumbSize}>
      {images.length < 1 || images?.some((i) => !i) ? (
        <div className="product-images-slider-error">
          <img src={NOT_FOUND_IMG} alt="NOT_FOUND_IMG" />
        </div>
      ) : (
        <>
          <Swiper
            loop={true}
            slidesPerView={1}
            spaceBetween={10}
            navigation={images.length > 1}
            modules={[Navigation, Thumbs]}
            grabCursor={true}
            thumbs={{ swiper: activeThumb }}
            className="product-images-slider"
          >
            {images.map((item, index) => (
              <SwiperSlide key={item._id + "product-images-slider"}>
                <img src={item.url} alt={item._id} />
              </SwiperSlide>
            ))}
          </Swiper>
          <Swiper
            onSwiper={setActiveThumb}
            loop={direction === "x" && images.length > 4}
            spaceBetween={10}
            slidesPerView={4}
            modules={[Navigation, Thumbs]}
            className="product-images-slider-thumbs"
          >
            {images.map((item, index) => (
              <SwiperSlide key={item._id + "product-images-slider-thumbs"}>
                <div className="product-images-slider-thumbs-wrapper">
                  <img src={item.url} alt={item._id} />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </>
      )}
      {actions && <div className="actions-on-image">{actions}</div>}
    </SliderWrapper>
  );
};

const SliderWrapper = styled.div`
  position: relative;
  width: 100%;
  height: ${(props) => String(props.slideHeight) + "px"};
  overflow: hidden;
  display: flex;
  align-items: flex-start;
  flex-wrap: ${(props) => (props.direction === "x" ? "nowrap" : "wrap-reverse")};
  flex-shrink: 0;
  & .actions-on-image {
    position: absolute;
    bottom: ${(props) => (props.direction === "x" ? "10px" : String(props.thumbSize + 32) + "px")};
    right: 24px;
    z-index: 10;
    border-radius: 5px;
    padding: 4px 12px;
    background-color: ${(props) => rgba(props.theme.generatedColors[0], 0.5)};
    backdrop-filter: blur(4px);
    & a {
      text-decoration: underline;
      font-size: 16px;
    }
    &:hover {
      background-color: ${(props) => props.theme.generatedColors[0]};
    }
  }
  & .product-images-slider-error {
    width: 100%;
    height: ${(props) => String(props.slideHeight) + "px"};
    overflow: hidden;
    & > img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: center;
    }
  }
  & .product-images-slider {
    width: 100%;
    height: 100%;
    max-height: ${(props) => String(props.slideHeight) + "px"};
    overflow: hidden;
    border-radius: 5px;
    & .swiper-slide {
      padding-top: 100%;
      overflow: hidden;
      position: relative;
      border-radius: 5px;

      img {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        object-fit: cover;
        object-position: center center;
      }
    }

    & .swiper-button-prev {
      left: 8px;
      color: #fff;
      mix-blend-mode: difference;
    }

    & .swiper-button-next {
      right: 8px;
      color: #fff;
      mix-blend-mode: difference;
    }
  }

  & .product-images-slider-thumbs {
    order: -1;
    flex-shrink: 0;
    margin-top: ${(props) => (props.direction === "x" ? 0 : "10px")};
    margin-left: ${(props) => (props.direction === "x" ? "auto" : 0)};

    & .swiper-slide {
      cursor: pointer;
      border-radius: 5px;
      position: relative;
      width: ${(props) => String(props.thumbSize) + "px"} !important;

      &-thumb-active::before {
        content: "";
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0px;
        right: 0px;
        z-index: 1;
        backdrop-filter: blur(0.8px);
        background: linear-gradient(230deg, #fff 0%, transparent 100%);
      }
    }
    & .swiper-wrapper {
      flex-direction: ${(props) => (props.direction === "x" ? "column" : "row")};
      gap: ${(props) => (props.direction === "x" ? "10px" : 0)};
      transform: translate3d(0px, 0px, 0px) !important;
    }

    &-wrapper {
      width: 100%;
      padding-top: 100%;
      overflow: hidden;
      position: relative;
      border-radius: 5px;

      img {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }
  }
`;

export default ThumbsSlider;
