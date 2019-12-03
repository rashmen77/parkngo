import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";

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
            <img className="nav-logo" src="../assets/Driveways.png" />
          </Link>

          <div className="nav-link">
            <Link to="/about">About</Link>
            <Link to="/rentDriveway">Rent out your driveway</Link>
            {!this.props.lgin ? (
              <>
                <Link to="/login">Login</Link>
                <Link to="/signup">
                  <button className="button_med">Signup</button>
                </Link>
              </>
            ) : (
              <div className="dropdown">
                <button className="dropbtn">
                  <img
                    style={{ cursor: "pointer" }}
                    height="40px"
                    src="../assets/NoUserProfileImage.png"
                  />
                </button>
                <div className="dropdown-content">
                  <a>Profile</a>
                  <a>Posts</a>
                  <a onClick={this.userLogout}>Logout</a>
                </div>
              </div>
            )}
          </div>
        </nav>
      </header>
    );
  }
}
let mapStateToProps = state => {
  return { lgin: state.loggedIn };
};
let NavBar = connect(mapStateToProps)(UnconnectedNavBar);

export default NavBar;
