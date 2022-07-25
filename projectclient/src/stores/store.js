import { combineReducers, configureStore, isRejectedWithValue } from "@reduxjs/toolkit";
// import { loadingBarMiddleware } from "react-redux-loading-bar";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";

import authReducer from "./auth/auth.reducer";
import userReducer from "./user/user.reducer";
import themeReducer from "./theme/theme.reducer";
import headerReducer from "./header/header.reducer";

import { addressApi } from "./address/address.query";
import { cascadesApi } from "./address/cascades.query";
import { authApi } from "./auth/auth.query";
import { categoryApi } from "./category/category.query";
import { comboApi } from "./combo/combo.query";
import { contentApi } from "./content/content.query";
import { orderApi } from "./order/order.query";
import { productApi } from "./product/product.query";
import { reviewApi } from "./review/review.query";
import { statisticApi } from "./statistic/statistic.query";
import { userApi } from "./user/user.query";
import { imageApi } from "./image/image.query";
import { galleryApi } from "./unsplash/gallery.query";
import { stripeApi } from "./stripe/stripe.query";
// import { notification } from "antd";

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth", "themeProvider"],
};

const reducers = combineReducers({
  auth: authReducer,
  themeProvider: themeReducer,
  headerState: headerReducer,
  user: userReducer,
  [imageApi.reducerPath]: imageApi.reducer,
  [addressApi.reducerPath]: addressApi.reducer,
  [authApi.reducerPath]: authApi.reducer,
  [categoryApi.reducerPath]: categoryApi.reducer,
  [comboApi.reducerPath]: comboApi.reducer,
  [contentApi.reducerPath]: contentApi.reducer,
  [orderApi.reducerPath]: orderApi.reducer,
  [productApi.reducerPath]: productApi.reducer,
  [reviewApi.reducerPath]: reviewApi.reducer,
  [statisticApi.reducerPath]: statisticApi.reducer,
  [userApi.reducerPath]: userApi.reducer,
  [galleryApi.reducerPath]: galleryApi.reducer,
  [stripeApi.reducerPath]: stripeApi.reducer,
  [cascadesApi.reducerPath]: cascadesApi.reducer,
});

const persistedReducer = persistReducer(persistConfig, reducers);
export const rtkQueryErrorLogger = (api) => (next) => (action) => {
  if (isRejectedWithValue(action)) {
    console.warn(action.payload);
    // const { status, data } = action.payload;
    // if (![404, 401].includes(status))
    //   message.error({ content: `${status || 400} : ${data?.err || "Đã có lỗi xảy ra"}` });
  }

  return next(action);
};

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat([
      rtkQueryErrorLogger,
      // loadingBarMiddleware({
      //   promiseTypeSuffixes: ["pending", "fulfilled", "rejected"],
      // }),
      imageApi.middleware,
      addressApi.middleware,
      authApi.middleware,
      categoryApi.middleware,
      comboApi.middleware,
      contentApi.middleware,
      orderApi.middleware,
      productApi.middleware,
      reviewApi.middleware,
      statisticApi.middleware,
      userApi.middleware,
      stripeApi.middleware,
      galleryApi.middleware,
      cascadesApi.middleware,
    ]),
});

export const persistor = persistStore(store);
