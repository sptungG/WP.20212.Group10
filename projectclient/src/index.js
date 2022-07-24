import React from "react";
import { BrowserRouter } from "react-router-dom";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { store } from "src/stores/store";
import App from "./App";
import "./index.css";

ReactDOM.render(
  // <React.StrictMode>
  <Provider store={store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>,
  // </React.StrictMode>,
  document.getElementById("root")
);
