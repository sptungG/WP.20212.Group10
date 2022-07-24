export class BaseFilter {
  constructor({ page, limit, keyword }) {
    this.page = page || 1;
    this.limit = limit || 4;
    this.keyword = keyword || "";
  }
}

export class ProductsFilter extends BaseFilter {
  constructor({ sort, rating, price, page, limit, keyword, color, category }) {
    super({ page, limit, keyword });
    this.sort = sort || "";
    this.rating = rating || "";
    this.price = price || "";
    this.color = color || "";
    this.category = category || "";
  }
}

export class CombosFilter extends BaseFilter {
  constructor({ sort, page, limit, keyword }) {
    super({ page, limit, keyword });
    this.sort = sort || "";
  }
}

export const NOT_FOUND_IMG =
  "https://firebasestorage.googleapis.com/v0/b/setup-store-v2.appspot.com/o/image-not-found.png?alt=media&amp;token=ef8ba34b-0474-4c3f-8bb6-e6536e819e8f";

export const THANKYOU_IMG =
  "https://firebasestorage.googleapis.com/v0/b/setup-store-v2.appspot.com/o/Watercolor%20Purple%20Thank%20%20You%20Card%20.svg?alt=media&token=b96f5e78-d08d-44a5-8f3f-4361d368cb47";

export const THANKYOU_IMG_1 =
  "https://firebasestorage.googleapis.com/v0/b/setup-store-v2.appspot.com/o/Thank-You-Card.svg?alt=media&token=94974d18-69de-42db-9eed-a8c627d5208b";

export const CONSTANT = {
  ORDER_STATUSES: [
    {
      value: "PROCESSING",
      name: "Đơn đang được xử lý",
    },
    {
      value: "CANCELLING",
      name: "Đang hủy đơn",
    },
    {
      value: "PACKED",
      name: "Đã đóng gói",
    },
    {
      value: "DELIVERING",
      name: "Đang giao hàng",
    },
    {
      value: "DELIVERED",
      name: "Đã giao hàng",
    },
    {
      value: "CANCELLED",
      name: "Đã hủy",
    },
  ],
};
