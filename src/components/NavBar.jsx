import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { FaSatellite } from "react-icons/fa";

class UnconnectedNavBar extends Component {
  userLogout = async () => {
    let response = await fetch("/logout");
    let reponseBody = await response.text();
    let body = JSON.parse(reponseBody);
    console.log(body);

    this.props.dispatch({
      type: "login-fail"
    });
  };

  render() {
    return (
      <header>
        <nav>
          <Link to="/">
            <img className="nav-logo" src="../assets/logo.svg" />
          </Link>

          <div className="nav-link">
            <Link to="/about">About</Link>
            <Link className="nav-listProperty-link" to="/listProperty">
              List your property
            </Link>
          </div>
          {!this.props.lgin ? (
            <div className="nav-login-signup">
              <Link to="/login">Login</Link>
              <Link to="/signup">
                <button className="button_med">Signup</button>
              </Link>
            </div>
          ) : (
            <div className="dropdown">
              <button className="dropbtn">
                {console.log("nav user ", this.props.currentUser)}
                {this.props.currentUser.file === "" ? (
                  <img
                    className="navbar-profile-img"
                    style={{ cursor: "pointer" }}
                    height="55px"
                    src="../assets/NoUserProfileImage.png"
                  />
                ) : (
                  <img
                    className="navbar-profile-img"
                    style={{ cursor: "pointer" }}
                    height="45px"
                    width="50px"
                    src={"../.." + this.props.currentUser.fileURL}
                  ></img>
                )}
              </button>
              <div className="dropdown-content">
                <Link to="/editProfile">Profile</Link>
                <Link to="/userPosts">Posts</Link>
                <Link to="/purchaseHistory">Purchases</Link>
                <a onClick={this.userLogout}>Logout</a>
              </div>
            </div>
          )}
        </nav>
      </header>
    );
  }
}
let mapStateToProps = state => {
  return { lgin: state.loggedIn, currentUser: state.user };
};
let NavBar = connect(mapStateToProps)(UnconnectedNavBar);

export default NavBar;
