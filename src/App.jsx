import React, { Component } from "react";
import { Route, BrowserRouter } from "react-router-dom";
import Signup from "./components/Signup.jsx";
import Login from "./components/Login.jsx";
import { connect } from "react-redux";
import Navbar from "./components/NavBar.jsx";
import Register from "./components/Register.jsx";
import LandingPage from "./components/LandingPage.jsx";
import SearchResultsMap from "./components/SearchResultsMap.jsx";
import RentDriveway from "./components/RentDriveway.jsx";

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

  render = () => {
    return (
      <BrowserRouter>
        <main>
          <Navbar></Navbar>
          <Route exact={true} path="/" component={LandingPage}></Route>
          <Route exact={true} path="/login" component={Login}></Route>
          <Route exact={true} path="/signup" component={Signup}></Route>
          <Route exact={true} path="/register" component={Register}></Route>
          <Route
            exact={true}
            path="/searchResults"
            component={SearchResultsMap}
          ></Route>
          <Route
            exact={true}
            path="/rentDriveway"
            component={RentDriveway}
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
