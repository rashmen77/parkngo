import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { FaGoogle } from "react-icons/fa";
import "../css/signup.css";

class UnconnectedSignup extends Component {
  render() {
    return (
      <div className="signup-Container">
        <div className="signup-text">Create an account to continue</div>
        <div className="signup-box">
          <button className="signup_btn">
            <FaGoogle className="icon" />
            <span className="googleSpan">Continue with Google</span>
          </button>
          <Link to="/login">
            <button className="signup_btn">
              Sign in with my email address
            </button>
          </Link>
          <Link to="/register">
            <button className="signup_btn">
              Create account with my email address
            </button>
          </Link>
        </div>
      </div>
    );
  }
}
let mapStateToProps = state => {
  return { lgin: state.loggedIn };
};
let Signup = connect(mapStateToProps)(UnconnectedSignup);

export default Signup;
