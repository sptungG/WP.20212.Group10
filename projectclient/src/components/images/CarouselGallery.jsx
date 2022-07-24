import { Carousel } from "antd";
import React from "react";
import setup00 from "src/assets/setup00.png";
import setup01 from "src/assets/setup01.png";
import setup02 from "src/assets/setup02.png";
import setup03 from "src/assets/setup03.png";
import setup04 from "src/assets/setup04.png";

const IMAGES = [setup00, setup01, setup02, setup03, setup04];

const CarouselGallery = ({ size = 120 }) => {
  return (
    <Carousel
      autoplay
      speed={3600}
      dots={false}
      dotPosition="bottom"
      easing="ease-in"
      effect="scrollx"
      pauseOnHover={false}
    >
      {IMAGES.map((item, index) => (
        <div key={index + 1} style={{ width: size, height: size }}>
          <img
            alt={index}
            src={item}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </div>
      ))}
    </Carousel>
  );
};

export default CarouselGallery;
