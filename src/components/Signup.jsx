import React, { Component } from "react";
import { connect } from "react-redux";

class UnconnectedSignup extends Component {
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
    console.log("username", this.state.username);
    console.log("password", this.state.passwordInput);
    let name = this.state.usernameInput;
    let data = new FormData();
    data.append("username", name);
    data.append("password", this.state.passwordInput);
    let response = await fetch("/signup", { method: "POST", body: data });
    let body = await response.text();
    console.log("/login response", body);
    body = JSON.parse(body);
    if (body.success) {
      this.props.dispatch({
        type: "login-success"
      });
    } else {
      this.props.dispatch({
        type: "login-fail"
      });
      alert("Signup Failure");
    }
  };
  render() {
    return (
      <div>
        <h2>Signup</h2>
        <form onSubmit={this.submitHandler}>
          Username <input type="text" onChange={this.usernameChange} />
          Password <input type="text" onChange={this.passwordChange} />
          <input type="submit" value="signup" />
        </form>
      </div>
    );
  }
}
let mapStateToProps = state => {
  return { lgin: state.loggedIn };
};
let Signup = connect(mapStateToProps)(UnconnectedSignup);

export default Signup;
