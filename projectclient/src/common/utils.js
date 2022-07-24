import moment from "moment";
import { dateFormat } from "src/components/picker/RangePicker";

export const formatFromNow = (date) => moment(date).fromNow();

export const formatDate = (date, format = dateFormat) => moment(date).format(format);

export const isSameTime = (date1, date2) => moment(date1).isSame(moment(date2));

export const isBetweenDate = (date, fromDate, toDate) => moment(date).isBetween(fromDate, toDate);

export const sorterByWords = (sorterKey) => (a, b) =>
  vietnameseSlug(a[sorterKey]) > vietnameseSlug(b[sorterKey])
    ? 1
    : vietnameseSlug(b[sorterKey]) > vietnameseSlug(a[sorterKey])
    ? -1
    : 0;

export const getNameByValue = (value = "", arr = []) =>
  arr.find((item) => item.value === value)?.name || null;

export const sorterByDate = (sorterKey) => (a, b) => moment(b[sorterKey]) - moment(a[sorterKey]);

export const getBadgeColorByStatus = (s) => {
  switch (s) {
    case "active":
      return "green";
    case "inactive":
      return "#8c8c8c";
    case "deleted":
      return "red";
    default:
      return "yellow";
  }
};

export const setColorByStatus = (orderStatus) => {
  switch (orderStatus.toUpperCase()) {
    case "PROCESSING":
      return "blue";
    case "CANCELLING":
      return "yellow";
    case "PACKED":
      return "green";
    case "DELIVERING":
      return "blue";
    case "DELIVERED":
      return "green";
    case "CANCELLED":
      return "red";
    default:
      return "#8c8c8c";
  }
};

export const findImageById = (id = "", images = []) => {
  return id ? images.find((item) => item._id === id) : null;
};

export const bindParamsFilter = (filter) => {
  const params = Object.keys(filter)
    .filter((key) => filter[key] === false || filter[key] === 0 || !!filter[key])
    .map((key) => `${key}=${filter[key]}`);
  return params.join("&");
};

export const convertToNumber = (value) => (Number.isNaN(Number(value)) ? 0 : Number(value));

export const getTotalPage = (total, limit) => {
  let totalPage =
    total % limit === 0 ? (total - (total % limit)) / limit : (total - (total % limit)) / limit + 1;
  totalPage = convertToNumber(totalPage);
  return totalPage === 0 ? 1 : totalPage;
};

export const checkValidColor = (value) =>
  value ? /^#[0-9a-f]{3}(?:[0-9a-f]{3})?$/i.test(value.replace(/\s/g, "")) : false;

export const vietnameseSlug = (str, separator = "-") => {
  if (str) {
    str = str.trim();
    str = str.toLowerCase();
    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
    str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
    str = str.replace(/đ/g, "d");
    // Some system encode vietnamese combining accent as individual utf-8 characters
    // Một vài bộ encode coi các dấu mũ, dấu chữ như một kí tự riêng biệt nên thêm hai dòng này
    str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, ""); // ̀ ́ ̃ ̉ ̣  huyền, sắc, ngã, hỏi, nặng
    str = str.replace(/\u02C6|\u0306|\u031B/g, ""); // ˆ ̆ ̛  Â, Ê, Ă, Ơ, Ư
    // Remove extra spaces
    // Bỏ các khoảng trắng liền nhau
    str = str.replace(/ + /g, "");
    // Remove punctuations
    // Bỏ dấu câu, kí tự đặc biệt
    str = str.replace(
      /!|@|%|\^|\*|\(|\)|\+|\\=|\\<|\\>|\?|\/|,|\.|\\:|\\;|\\'|\\"|\\&|\\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g,
      ""
    );
    str = str.replace(/ +/g, "-");
    if (separator) {
      return str.replace(/-/g, separator);
    }
    return str;
  } else return "";
};
