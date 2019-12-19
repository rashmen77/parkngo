import React, { Component } from "react";
import { Route, BrowserRouter } from "react-router-dom";
import Signup from "./components/Signup.jsx";
import Login from "./components/Login.jsx";
import { connect } from "react-redux";
import Navbar from "./components/NavBar.jsx";
import Register from "./components/Register.jsx";
import LandingPage from "./components/LandingPage.jsx";
import SearchResultsMap from "./components/SearchResultsMap.jsx";
import ListProperty from "./components/ListProperty.jsx";
import ParkingDetails from "./components/ParkingDetails.jsx";
import UserPosts from "./components/UserPosts.jsx";
import EditPost from "./components/EditPost.jsx";
import Footer from "./components/Footer.jsx";
import EditProfile from "./components/EditProfile.jsx";
import CheckOut from "./components/CheckOut.jsx";
import Purchases from "./components/Purchases.jsx";

class UnconnectedApp extends Component {
  checkStatus = async () => {
    let response = await fetch("/checkLogined");
    let reponseBody = await response.text();
    let body = JSON.parse(reponseBody);
    console.log("Current user loggedIn", body);

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

  renderPostDetails = rd => {
    let postID = rd.match.params.postID;
    return <ParkingDetails postID={postID}></ParkingDetails>;
  };

  editPost = rd => {
    let postID = rd.match.params.postID;
    return <EditPost postID={postID}></EditPost>;
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
            path="/postDetails/:postID"
            render={this.renderPostDetails}
          ></Route>
          <Route
            exact={true}
            path="/listProperty"
            component={ListProperty}
          ></Route>
          <Route exact={true} path="/checkOut" component={CheckOut}></Route>
          <Route
            exact={true}
            path="/editProfile"
            component={EditProfile}
          ></Route>
          <Route
            exact={true}
            path="/editPost/:postID"
            render={this.editPost}
          ></Route>
          <Route
            exact={true}
            path="/purchaseHistory"
            component={Purchases}
          ></Route>
          <Route exact={true} path="/userPosts" component={UserPosts}></Route>
          <Footer></Footer>
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
