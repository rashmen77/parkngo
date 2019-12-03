import React, { Component } from "react";
import { Route, BrowserRouter } from "react-router-dom";
import Signup from "./components/Signup.jsx";
import Login from "./components/Login.jsx";
import { connect } from "react-redux";
import Navbar from "./components/NavBar.jsx";
import Register from "./components/Register.jsx";

class UnconnectedApp extends Component {
  checkStatus = async () => {
    let response = await fetch("/checkLogined");
    let reponseBody = await response.text();
    let body = JSON.parse(reponseBody);
    console.log(body);

    if (body.success) {
      this.props.dispatch({
        type: "login-success",
        value: body.data
      });
    } else {
      this.props.dispatch({
        type: "login-fail"
      });
    }
  };

  componentDidMount = () => {
    this.checkStatus();
  };

  login = () => {
    return <Login></Login>;
  };
  signup = () => {
    return <Signup></Signup>;
  };
  register = () => {
    return <Register></Register>;
  };

  render = () => {
    return (
      <BrowserRouter>
        <main>
          <Navbar></Navbar>
          <Route exact={true} path="/login" component={this.login}></Route>
          <Route exact={true} path="/signup" component={this.signup}></Route>
          <Route
            exact={true}
            path="/register"
            component={this.register}
          ></Route>
        </main>
      </BrowserRouter>
    );
  };
}

let mapStateToProps = state => {
  return { lgin: state.loggedIn };
};
let App = connect(mapStateToProps)(UnconnectedApp);

export default App;
