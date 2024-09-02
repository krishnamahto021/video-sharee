import React from "react";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import { RouterProvider } from "react-router-dom";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { router } from "./router";
import { Toaster } from "sonner";

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <Toaster position="top-right" richColors closeButton />
      <RouterProvider router={router}></RouterProvider>
    </Provider>
  );
};

export default App;
