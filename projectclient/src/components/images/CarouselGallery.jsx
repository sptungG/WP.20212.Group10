import { Carousel } from "antd";
import React from "react";
const setup00 = "https://firebasestorage.googleapis.com/v0/b/setup-store-v2.appspot.com/o/setup00.png?alt=media&token=0478a830-880e-4cea-8423-44b6e5e27747";
const setup01 = "https://firebasestorage.googleapis.com/v0/b/setup-store-v2.appspot.com/o/setup01.png?alt=media&token=e986a777-5365-434c-bdbe-5365348e9b81";
const setup02 = "https://firebasestorage.googleapis.com/v0/b/setup-store-v2.appspot.com/o/setup02.png?alt=media&token=e72156f1-7ebf-48ca-817d-5a63d7d28c3a";
const setup03 = "https://firebasestorage.googleapis.com/v0/b/setup-store-v2.appspot.com/o/setup03.png?alt=media&token=e9aa8e7d-7110-4be4-b00c-8f316b43a571";
const setup04 = "https://firebasestorage.googleapis.com/v0/b/setup-store-v2.appspot.com/o/setup04.png?alt=media&token=570067b9-4fad-4999-b058-8183ce8cd0b4";

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
