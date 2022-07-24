import { message, Space } from "antd";
import { BsBoxArrowUpRight } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import { useToggleProductWishlistMutation } from "src/stores/product/product.query";
import { useAuth } from "./useAuth";
import { useChangeThemeProvider } from "./useChangeThemeProvider";

export const isWishlisted = (wishlist = [], userId) =>
  userId && !!wishlist?.find((u) => u._id === userId);

export function useToggleWishlist() {
  const { isSignedIn, user, message401 } = useAuth();
  const [toggleProductWishlist, { isLoading: toggleProductWishlistLoading }] =
    useToggleProductWishlistMutation();
  const handleToggleWishlist = async (productId, isWishlisted) => {
    try {
      if (!isSignedIn) return message401();
      const productInWishlist = await toggleProductWishlist({ productId }).unwrap();
      if (!isWishlisted) {
        message.success("Thêm vào yêu thích thành công");
      } else {
        message.error("Hủy yêu thích thành công");
      }
    } catch (err) {
      console.log("err", err);
    }
  };

  // console.log("useAddToCart ~ cart", cart);

  return {
    toggleProductWishlistLoading,
    handleToggleWishlist,
  };
}
