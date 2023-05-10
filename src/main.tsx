import "frotsi";
import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";

import "./index.scss";
import { AppRouter } from "src/app/router/AppRouter";

const prodDev = true;
if (!prodDev) {
  console.log = (a: any, ...b: any) => undefined;
}

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <RouterProvider router={AppRouter} />
  </React.StrictMode>
);
