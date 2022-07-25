import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { ConfigProvider, message } from "antd";
import "antd/dist/antd.variable.min.css";
import { getRedirectResult, onAuthStateChanged } from "firebase/auth";
import { lazy, Suspense, useEffect, useLayoutEffect } from "react";
import { useDispatch } from "react-redux";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import { PersistGate } from "redux-persist/integration/react";
import { auth } from "src/common/firebase-config";
import Loader from "src/components/loader/Loader";
import ErrorResult from "src/components/nav/ErrorResult";
import { ThemeProvider } from "styled-components";
import "swiper/css";
import "swiper/css/autoplay";
import "swiper/css/effect-creative";
import "swiper/css/navigation";
import "swiper/css/parallax";
import "swiper/css/thumbs";
import { useAuth } from "./common/useAuth";
import { useChangeThemeProvider } from "./common/useChangeThemeProvider";
import AdminRoute from "./routes/AdminRoute";
import GuestRoute from "./routes/GuestRoute";
import PrivateRoute from "./routes/PrivateRoute";
import { useCreateOrUpdateUserMutation, useCurrentUserMutation } from "./stores/auth/auth.query";
import { setAuthtokenCredential, setRefreshToken } from "./stores/auth/auth.reducer";
import { setDataRedirectStatus } from "./stores/header/header.reducer";
import { persistor } from "./stores/store";
import { setUser } from "./stores/user/user.reducer";

const HomePage = lazy(() => import("src/pages/home/HomePage"));
const StorePage = lazy(() => import("src/pages/filter/StorePage"));
const ProductDetailPage = lazy(() => import("src/pages/product/ProductDetailPage"));
const UserCartPage = lazy(() => import("src/pages/cart/UserCartPage"));
const CheckoutPage = lazy(() => import("src/pages/checkout/CheckoutPage"));
const CheckoutCODPage = lazy(() => import("src/pages/checkout/CheckoutCODPage"));
const ProfilePage = lazy(() => import("src/pages/user/ProfilePage"));
const LoginPage = lazy(() => import("src/pages/auth/LoginPage"));
const RegisterPage = lazy(() => import("src/pages/auth/RegisterPage"));
const ForgotPasswordPage = lazy(() => import("src/pages/auth/ForgotPasswordPage"));
const VerificationPage = lazy(() => import("src/pages/auth/VerificationPage"));
//
const DashboardPage = lazy(() => import("src/pagesadmin/DashboardPage"));
const CategoryListPage = lazy(() => import("src/pagesadmin/category/CategoryListPage"));
const ComboListPage = lazy(() => import("src/pagesadmin/combo/ComboListPage"));
const ComboDetailPage = lazy(() => import("src/pagesadmin/combo/ComboDetailPage"));
const OrderListPage = lazy(() => import("src/pagesadmin/order/OrderListPage"));
const OrderDetailPage = lazy(() => import("src/pagesadmin/order/OrderDetailPage"));
const ProductTableListPage = lazy(() => import("src/pagesadmin/product/ProductTableListPage"));
const ProductCreateUpdateDetailPage = lazy(() =>
  import("src/pagesadmin/product/ProductCreateUpdateDetailPage")
);
const UserListPage = lazy(() => import("src/pagesadmin/user/UserListPage"));
const UserDetailPage = lazy(() => import("src/pagesadmin/user/UserDetailPage"));
const ReviewProductListPage = lazy(() => import("src/pagesadmin/review/ReviewProductListPage"));
const AdminSettingPage = lazy(() => import("src/pagesadmin/setting/AdminSettingPage"));
// Make sure to call loadStripe outside of a component’s render to avoid
// recreating the Stripe object on every render.
// This is your test publishable API key.
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_KEY);
message.config({
  maxCount: 1,
});
function App() {
  let navigate = useNavigate();
  const { logout, user, credential, messageLock } = useAuth();
  const [currentUser] = useCurrentUserMutation();
  const [createOrUpdateUser] = useCreateOrUpdateUserMutation();
  const { themeProvider } = useChangeThemeProvider();
  const dispatch = useDispatch();

  useLayoutEffect(() => {
    if (user == null && credential.authtoken == null && credential.refreshToken == null) {
      dispatch(setDataRedirectStatus("loading"));
      getRedirectResult(auth)
        .then(async (result) => {
          if (!result) return dispatch(setDataRedirectStatus("noLoading"));
          const { user } = result;
          const idTokenResult = await user.getIdTokenResult();
          const res = await createOrUpdateUser(idTokenResult.token).unwrap();
          if (["deleted", "inactive"].includes(res.status)) {
            messageLock(res.email);
            throw new Error(`${res.email} is inactive!`);
          } else {
            dispatch(setRefreshToken(user.refreshToken));
            dispatch(setAuthtokenCredential(idTokenResult.token));
            dispatch(setUser(res));
          }
          dispatch(setDataRedirectStatus("noLoading"));
          navigate("/", { replace: true });
        })
        .catch((err) => {
          console.log("signInWithRedirect", err);
          dispatch(setDataRedirectStatus("noLoading"));
          navigate("/", { replace: true });
        });
    }
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          if (!user.emailVerified) throw new Error(`${user.email} hasn't verified yet!`);
          const idTokenResult = await user.getIdTokenResult();
          const res = await currentUser(idTokenResult.token).unwrap();
          if (["deleted", "inactive"].includes(res.status)) {
            messageLock(res.email);
            throw new Error(`${res.email} is inactive!`);
          } else {
            dispatch(setAuthtokenCredential(idTokenResult.token));
            dispatch(setRefreshToken(user.refreshToken));
            dispatch(setUser(res));
          }
        } catch (err) {}
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    ConfigProvider.config({
      theme: {
        primaryColor: themeProvider.primaryColor,
      },
    });
  }, [themeProvider.primaryColor]);

  return (
    <ThemeProvider
      theme={{
        mode: themeProvider.mode,
        primaryColor: themeProvider.primaryColor,
        generatedColors: themeProvider.generatedColors,
      }}
    >
      <PersistGate loading={<Loader />} persistor={persistor}>
        {/* <LoadingBarContainer
          maxProgress={85}
          updateTime={100}
          progressIncrease={10}
          style={{ backgroundColor: '#08f', position: "fixed" }}
        /> */}
        <Suspense fallback={<Loader />}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/store" element={<StorePage />} />
            <Route path="/cart" element={<UserCartPage />} />
            <Route path="/products/:productId" element={<ProductDetailPage />} />

            <Route element={<PrivateRoute />}>
              <Route
                path="/checkout"
                element={
                  <Elements stripe={stripePromise}>
                    <CheckoutPage />
                  </Elements>
                }
              />
              <Route path="/checkout/cod" element={<CheckoutCODPage />} />
              <Route path="/profile" element={<ProfilePage />} />
            </Route>

            <Route element={<GuestRoute />}>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/verification/*" element={<VerificationPage />} />
              <Route path="/forgot/password" element={<ForgotPasswordPage />} />
            </Route>
            <Route element={<AdminRoute />}>
              <Route path="/admin/dashboard" element={<DashboardPage />} />
              <Route path="/admin/categories" element={<CategoryListPage />} />
              <Route path="/admin/categories/:categoryId" element={<CategoryListPage />} />
              <Route path="/admin/combos" element={<ComboListPage />} />
              <Route path="/admin/combos/*" element={<ComboDetailPage />} />
              <Route path="/admin/orders" element={<OrderListPage />} />
              <Route path="/admin/orders/*" element={<OrderDetailPage />} />
              <Route path="/admin/products" element={<ProductTableListPage />} />
              <Route path="/admin/products/create" element={<ProductCreateUpdateDetailPage />} />
              <Route
                path="/admin/products/:productId"
                element={<ProductCreateUpdateDetailPage />}
              />
              <Route path="/admin/users" element={<UserListPage />} />
              <Route path="/admin/reviews" element={<ReviewProductListPage />} />
              <Route path="/admin/setting" element={<AdminSettingPage />} />
            </Route>

            <Route path="/404" element={<ErrorResult status="404" />} />

            <Route path="*" element={<Navigate to="/404" replace />} />
          </Routes>
        </Suspense>
      </PersistGate>
    </ThemeProvider>
  );
}

export default App;
