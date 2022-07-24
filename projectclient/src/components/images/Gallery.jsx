import React from "react";
import { Image, Skeleton, Card } from "antd";
import MasonryLayout from "./MasonryLayout";
import { useGetGalleryPhotosQuery } from "src/stores/unsplash/gallery.query";
import { NOT_FOUND_IMG } from "src/common/constant";
import { useMediaQuery } from "react-responsive";

const Gallery = ({ count = 9, column = 3 }) => {
  const mediaBelow768 = useMediaQuery({ maxWidth: 768 });
  const {
    data: photos,
    isUninitialized,
    isSuccess,
  } = useGetGalleryPhotosQuery(count, {
    skip: mediaBelow768 || process.env.REACT_APP_ENV !== "PRODUCTION",
  });

  return (
    <>
      {!isSuccess && (
        <MasonryLayout id="gallery" columns={column}>
          {Array(count)
            .fill(null)
            .map((item) => (
              <Card className="gallery-skeleton" key={item}>
                <Skeleton active></Skeleton>
              </Card>
            ))}
        </MasonryLayout>
      )}
      {isSuccess && (
        <MasonryLayout id="gallery" columns={column}>
          {photos.map((item) => (
            <Image
              key={item.id}
              width={"100%"}
              height={"100%"}
              src={item.urls.regular}
              alt={item.id}
              fallback={NOT_FOUND_IMG}
              placeholder={
                <Card className="gallery-skeleton">
                  <Skeleton active></Skeleton>
                </Card>
              }
            />
          ))}
        </MasonryLayout>
      )}
    </>
  );
};

export default Gallery;
