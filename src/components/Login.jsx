import React, { Component } from "react";
import { connect } from "react-redux";
import { Link, Redirect } from "react-router-dom";
import "../css/login.css";

class UnconnectedLogin extends Component {
  constructor() {
    super();
    this.state = {
      usernameInput: "",
      passwordInput: ""
    };
  }
  usernameChange = evt => {
    this.setState({ usernameInput: evt.target.value });
  };
  passwordChange = evt => {
    this.setState({ passwordInput: evt.target.value });
  };
  submitHandler = async evt => {
    evt.preventDefault();

    if (this.state.usernameInput === "" || this.state.passwordInput === "") {
      alert("Username / password missing");
      return;
    }
    console.log("username", this.state.username);
    console.log("password", this.state.passwordInput);
    let name = this.state.usernameInput;
    let data = new FormData();
    data.append("username", name);
    data.append("password", this.state.passwordInput);
    let response = await fetch("/login", { method: "POST", body: data });
    let body = await response.text();
    console.log("/login response", body);
    body = JSON.parse(body);
    if (body.success) {
      this.props.dispatch({
        type: "login-success",
        value: body.data
      });
    } else {
      this.props.dispatch({
        type: "login-fail"
      });
      alert("login-failure");
    }
  };
  renderRedirect = () => {
    if (this.props.lgin) {
      return <Redirect to="/" />;
    }
  };
  render() {
    return (
      <>
        {this.renderRedirect()}
        <div className="login-Container">
          <div className="login-text">
            Welcome back! Let’s get you signed in.
          </div>
          <div className="login-box">
            <h2>Login</h2>
            <form onSubmit={this.submitHandler}>
              <div className="textBox">
                <div>Username </div>
                <input type="text" onChange={this.usernameChange} />
              </div>
              <div className="textBox">
                <div>Password </div>
                <input type="password" onChange={this.passwordChange} />
              </div>
              <Link className="login-forgotPwd" to="/forgotPwd">
                I've forgotten my password
              </Link>
              <button className="login_btn" type="submit" value="login">
                Sign in
              </button>
            </form>
          </div>
        </div>
      </>
    );
  }
}
let mapStateToProps = state => {
  return { lgin: state.loggedIn };
};
let Login = connect(mapStateToProps)(UnconnectedLogin);

export default Login;
