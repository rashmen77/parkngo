import React, { Component } from "react";
import Signup from "./components/Signup.jsx";
import Login from "./components/Login.jsx";

class App extends Component {
  render = () => {
    return (
      <>
        <Login></Login>
        <Signup></Signup>
      </>
    );
  };
}

export default App;
