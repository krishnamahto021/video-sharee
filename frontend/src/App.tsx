import React from "react";
import SignUp from "./pages/auth/SignUp";
import SignIn from "./pages/auth/SignIn";
import { Provider } from "react-redux";
import { store } from "./redux/store";

const App: React.FC = () => {
  return (
    <Provider store={store}>
      {/* <SignUp /> */}
      <SignIn />
    </Provider>
  );
};

export default App;
