import "frotsi";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";

import "./index.scss";
import { AppRouter } from "src/app/router/AppRouter";
ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  // <React.StrictMode>
  <RouterProvider router={AppRouter} />
  // </React.StrictMode>
);
