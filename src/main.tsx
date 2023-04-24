import "frotsi";
import React from "react";
import ReactDOM from "react-dom/client";
import "./index.scss";
import { RouterProvider } from "react-router-dom";
import { AppRouter } from "@@components/Routing/AppRouter";

const prodDev = true;
if (!prodDev) {
  console.log = (a: any, ...b: any) => undefined;
}

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <RouterProvider router={AppRouter} />
  </React.StrictMode>
);
