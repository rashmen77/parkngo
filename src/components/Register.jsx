import React, { Component } from "react";
import { connect } from "react-redux";
import { Link, Redirect } from "react-router-dom";
import "../css/register.css";
import { FaGoogle } from "react-icons/fa";

class UnconnectedRegister extends Component {
  constructor() {
    super();
    this.state = {
      firstName: "",
      lastName: "",
      usernameInput: "",
      passwordInput: ""
    };
  }

  firstNameChange = evt => {
    this.setState({ firstName: evt.target.value });
  };
  lastNameChange = evt => {
    this.setState({ lastName: evt.target.value });
  };
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
    let firstName = this.state.firstName;
    let lastName = this.state.lastName;
    let data = new FormData();
    data.append("firstName", firstName);
    data.append("lastName", lastName);
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
  renderRedirect = () => {
    if (this.props.lgin) {
      return <Redirect to="/" />;
    }
  };
  render() {
    return (
      <>
        {this.renderRedirect()}

        <div className="register-container">
          <div className="register-box">
            <div className="register-title">
              <h2>Create an account to continue</h2>
            </div>

            <form onSubmit={this.submitHandler}>
              <div className="signup-field">
                <div className="signup-label">First name</div>
                <div className="signup-field-input">
                  <input type="text" onChange={this.firstNameChange} />
                </div>
              </div>
              <div className="signup-field">
                <div className="signup-label">Last name</div>
                <div className="signup-field-input">
                  <input type="text" onChange={this.lastNameChange} />
                </div>
              </div>
              <div className="signup-field">
                <div className="signup-label">Email address</div>
                <div className="signup-field-input">
                  <input type="text" onChange={this.usernameChange} />
                </div>
              </div>
              <div className="signup-field">
                <div className="signup-label">Password</div>
                <div className="signup-field-input">
                  <input type="text" onChange={this.passwordChange} />
                </div>
              </div>
              <button className="register-btn" type="submit" value="signup">
                Create account
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

let Register = connect(mapStateToProps)(UnconnectedRegister);

export default Register;
