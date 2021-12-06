import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { Provider, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "./store";
import store from "./store";
import { authActions } from "./store/auth-slice";

ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>,
  document.getElementById("root")
);
