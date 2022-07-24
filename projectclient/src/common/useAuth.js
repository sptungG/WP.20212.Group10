import { message, Space } from "antd";
import { signOut } from "firebase/auth";
import { BsBoxArrowUpRight } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useCurrentUserMutation } from "src/stores/auth/auth.query";
import { setAuthtokenCredential, setRefreshToken } from "src/stores/auth/auth.reducer";
import { setUser } from "src/stores/user/user.reducer";
import { auth } from "./firebase-config";
import { useChangeThemeProvider } from "./useChangeThemeProvider";

export function useAuth() {
  const credential = useSelector((state) => state.auth);
  const { data: user } = useSelector((state) => state.user);
  const [currentUser] = useCurrentUserMutation();
  const { themeProvider } = useChangeThemeProvider();
  let navigate = useNavigate();
  const dispatch = useDispatch();
  const isSignedIn =
    user != null && credential.authtoken != null && credential.refreshToken != null;
  const isAdmin = isSignedIn && user.role === "admin";

  const refetchCurrentUser = async () => {
    try {
      const res = await currentUser(credential.authtoken).unwrap();
      dispatch(setUser(res));
    } catch (err) {
      console.log("err", err);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      dispatch(setUser(null));
      dispatch(setAuthtokenCredential(null));
      dispatch(setRefreshToken(null));
      navigate("/");
    } catch (error) {
      console.log("handleLogout ~ error", error);
    }
  };

  // console.log("useAddToCart ~ cart", cart);

  const message401 = () => {
    message.loading({
      content: (
        <>
          <div>Đăng nhập rồi mới thao tác được!</div>
          <Space
            style={{ color: themeProvider.primaryColor, textDecoration: "underline" }}
            wrap={false}
            size={2}
          >
            <BsBoxArrowUpRight /> <span>Đi đến đăng nhập ngay</span>
          </Space>
        </>
      ),
      style: { cursor: "pointer" },
      onClick: () => {
        navigate("/login", { replace: true });
        message.destroy();
      },
      duration: 4,
    });
    return;
  };

  return {
    isAdmin,
    isSignedIn,
    user,
    credential,
    message401,
    refetchCurrentUser,
    logout,
  };
}
