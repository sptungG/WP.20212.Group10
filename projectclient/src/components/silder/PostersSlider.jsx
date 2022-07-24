import React, { useCallback, useEffect, useRef, useState } from "react";
import { NOT_FOUND_IMG } from "src/common/constant";
import Swiper, { Autoplay, EffectCreative, Navigation, Parallax, Thumbs } from "swiper";
import { Swiper as SwiperReact, SwiperSlide } from "swiper/react";
import styled from "styled-components";
import { rgba } from "polished";
import { Image } from "antd";

const PostersSlider = ({ images = [], actions = null, thumbSize = 52 }) => {
  const sliderRef = useRef(null);
  const [activeThumb, setActiveThumb] = useState();
  useEffect(() => {
    return () => {
      setActiveThumb();
    };
  }, []);

  const calcNextOffset = () => {
    if (sliderRef.current) {
      const swiperEl = sliderRef.current.querySelector(".swiper");
      const parentWidth = swiperEl.parentElement.offsetWidth;
      const swiperWidth = swiperEl.offsetWidth;
      let nextOffset = (parentWidth - (parentWidth - swiperWidth) / 2) / swiperWidth;
      nextOffset = Math.max(nextOffset, 1);
      return `${nextOffset * 100}%`;
    }
    return "100%";
  };

  return (
    <SliderWrapper className="poster-slider" thumbSize={thumbSize}>
      <Image.PreviewGroup>
        <div className="posters-slider" ref={sliderRef}>
          <SwiperReact
            modules={[Autoplay, Parallax, EffectCreative, Navigation, Thumbs]}
            thumbs={{ swiper: activeThumb }}
            effect={"creative"}
            speed={600}
            resistanceRatio={0}
            grabCursor={true}
            parallax={true}
            loop={true}
            autoplay={
              images.length > 1
                ? {
                    delay: 4000,
                    disableOnInteraction: false,
                    pauseOnMouseEnter: false,
                  }
                : false
            }
            navigation={true}
            slidesPerView={1}
            creativeEffect={{
              limitProgress: images.length > 0 ? images.length : 1,
              perspective: true,
              shadowPerProgress: true,
              prev: {
                shadow: true,
                translate: ["-25%", 0, -200],
              },
              next: {
                translate: [calcNextOffset(), 0, 0],
              },
            }}
          >
            {images.length > 0 ? (
              images.map((item, index) => (
                <SwiperSlide key={item._id + "product-images-slider"}>
                  <Image
                    width={"100%"}
                    height={"100%"}
                    data-swiper-parallax-scale="1.1"
                    src={item?.url || NOT_FOUND_IMG}
                    alt={item?._id || "NOT_FOUND_IMG"}
                  />
                </SwiperSlide>
              ))
            ) : (
              <SwiperSlide>
                <img data-swiper-parallax-scale="1.1" src={NOT_FOUND_IMG} alt="NOT_FOUND_IMG" />
              </SwiperSlide>
            )}
          </SwiperReact>
          {actions && <div className="actions-on-image">{actions}</div>}
        </div>
      </Image.PreviewGroup>
      <SwiperReact
        onSwiper={setActiveThumb}
        loop={false}
        spaceBetween={10}
        slidesPerView={4}
        modules={[Navigation, Thumbs]}
        className="product-images-slider-thumbs"
      >
        {images.length > 0 ? (
          images.map((item, index) => (
            <SwiperSlide key={item._id + "product-images-slider-thumbs"}>
              <div className="product-images-slider-thumbs-wrapper">
                <img
                  data-swiper-parallax-scale="1.1"
                  src={item?.url || NOT_FOUND_IMG}
                  alt={item?._id || "NOT_FOUND_IMG"}
                />
              </div>
            </SwiperSlide>
          ))
        ) : (
          <SwiperSlide>
            <div className="product-images-slider-thumbs-wrapper">
              <img data-swiper-parallax-scale="1.1" src={NOT_FOUND_IMG} alt="NOT_FOUND_IMG" />
            </div>
          </SwiperSlide>
        )}
      </SwiperReact>
    </SliderWrapper>
  );
};

const SliderWrapper = styled.div`
  position: relative;
  width: 100%;
  max-width: 432px;
  height: 100%;
  display: flex;
  align-items: flex-end;
  justify-content: flex-end;
  flex-direction: column-reverse;
  gap: 10px;
  flex-shrink: 0;
  & .actions-on-image {
    position: absolute;
    bottom: 24px;
    right: 24px;
    z-index: 10;
  }
  & .posters-slider {
    overflow: hidden;
    position: relative;
    box-sizing: border-box;
    width: 100%;
    margin: 0 auto;

    .swiper {
      overflow: visible;
      width: calc(100% - 52px);
      height: 360px;
      margin-right: 0;
      margin-left: 52px;
      @media screen and (max-width: 767.98px) {
        height: 280px;
      }
    }
    .swiper-slide {
      position: relative;
      border-radius: 10px;
      justify-content: center;
      display: flex;
    }
    .swiper-slide-shadow {
      background-color: ${(props) => props.theme.generatedColors[1]};
      backdrop-filter: blur(2px);
    }
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .swiper-button-prev {
      color: #fff;
      mix-blend-mode: difference;
      z-index: 10;
      height: 100%;
      transform: translateY(-50%);
      margin: 0;
      padding-left: 16px;
      left: 0;
    }

    .swiper-button-next {
      color: #fff;
      mix-blend-mode: difference;
      z-index: 10;
      height: 100%;
      transform: translateY(-50%);
      margin: 0;
      padding-right: 16px;
      right: 0;
    }
  }
  & .product-images-slider-thumbs {
    order: -1;
    flex-shrink: 0;
    margin-left: 52px;

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
      flex-direction: row;
      gap: 0;
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

export default PostersSlider;
