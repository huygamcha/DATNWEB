import "./App.css";
// import HomePage from "./Page/HomePage/Home";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import React from "react";
import HomePage from "./Page/HomePage/Home";
import ComparePage from "./Page/Compare";

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/dashboard",
    element: <ComparePage />,
  },
]);

function App() {
  return (
    // <HelmetProvider context={helmetContext}>
    <React.StrictMode>
      <RouterProvider router={router} />
    </React.StrictMode>
    // </HelmetProvider>
  );
}

export default App;
