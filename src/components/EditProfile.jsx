import React, { Component } from "react";
import { connect } from "react-redux";
import { Link, Redirect } from "react-router-dom";
import { FaFileImage } from "react-icons/fa";
import "../css/editProfile.css";

class UnconnectedEditProfile extends Component {
  constructor() {
    super();
    this.state = {
      firstName: "",
      lastName: "",
      usernameInput: "",
      passwordInput: "",
      file: undefined,
      preview: ""
    };
  }
  componentDidMount = () => {
    console.log("edit profile ", this.props.currentUser);
  };

  renderRedirect = () => {
    if (!this.props.lgin || this.props.currentUser === undefined) {
      return <Redirect to="/" />;
    }
  };

  handleFile = event => {
    event.preventDefault();
    console.log("upload media", event.target.files);
    this.setState({
      preview: URL.createObjectURL(event.target.files[0]),
      file: event.target.files[0]
    });
  };

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

    // if (this.state.file === undefined) {
    //   alert("no image selected");
    //   return;
    // }

    let userID = this.props.currentUser._id;

    let firstName = "";
    let lastName = "";
    let usernameInput = "";
    let passwordInput = "";
    let file = undefined;

    this.state.firstName === ""
      ? (firstName = this.props.currentUser.firstName)
      : (firstName = this.state.firstName);

    this.state.lastName === ""
      ? (lastName = this.props.currentUser.lastName)
      : (lastName = this.state.lastName);

    this.state.usernameInput === ""
      ? (usernameInput = this.props.currentUser.username)
      : (usernameInput = this.state.usernameInput);

    this.state.passwordInput === ""
      ? (passwordInput = this.props.currentUser.password)
      : (passwordInput = this.state.passwordInput);

    file = this.state.file;

    this.state.file === undefined
      ? (file = JSON.parse(this.props.currentUser.file))
      : (file = this.state.file);

    let data = new FormData();

    data.append("firstName", firstName);
    data.append("lastName", lastName);
    data.append("username", usernameInput);
    data.append("password", passwordInput);
    data.append("file", file);
    let response = await fetch("/editProfile?userID=" + userID, {
      method: "POST",
      body: data
    });

    let responseBody = await response.text();
    let body = JSON.parse(responseBody);
    if (body.success) {
      this.reloadUser();
      alert(body.message);
    } else {
      alert(body.message);
    }
  };

  reloadUser = async () => {
    let response = await fetch("/checkLogined");
    let reponseBody = await response.text();
    let body = JSON.parse(reponseBody);
    console.log("who am i ", body);

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

  render() {
    return (
      <>
        {this.renderRedirect()}

        <div className="editProfile-container">
          <div className="editProfile-box">
            <div className="editProfile-title">
              <h2>Edit Profile</h2>
            </div>
            <div className="editProfile-mediaContainer">
              <div className="editProfile-sectionLabel">Profile Picture</div>
              <div className="editProfile-mediaUpload">
                <div className="editProfile-preview">
                  {this.state.file ? (
                    <img
                      className="editProfile-loadPreview"
                      src={this.state.preview}
                    />
                  ) : this.props.currentUser.file === "" ? (
                    <img
                      className="editProfile-defaultdPreview"
                      src="../assets/NoUserProfileImage.png"
                    />
                  ) : (
                    <img
                      className="editProfile-defaultdPreview"
                      src={"../.." + this.props.currentUser.fileURL}
                    />
                  )}
                </div>
                <input
                  className="listProperty-button "
                  type="file"
                  onChange={this.handleFile}
                />
              </div>
            </div>
            <form onSubmit={this.submitHandler}>
              <div className="signup-field">
                <div className="signup-label">First name</div>
                <div className="signup-field-input">
                  {console.log("file list prop", this.state.firstName)}
                  <input
                    type="text"
                    defaultValue={this.props.currentUser.firstName}
                    onChange={this.firstNameChange}
                  />
                </div>
              </div>
              <div className="signup-field">
                <div className="signup-label">Last name</div>
                <div className="signup-field-input">
                  <input
                    type="text"
                    defaultValue={this.props.currentUser.lastName}
                    onChange={this.lastNameChange}
                  />
                </div>
              </div>
              <div className="signup-field">
                <div className="signup-label">Email address</div>
                <div className="signup-field-input">
                  <input
                    type="text"
                    defaultValue={this.props.currentUser.username}
                    onChange={this.usernameChange}
                  />
                </div>
              </div>
              <div className="signup-field">
                <div className="signup-label">Password</div>
                <div className="signup-field-input">
                  <input
                    type="password"
                    defaultValue={this.props.currentUser.password}
                    onChange={this.passwordChange}
                  />
                </div>
              </div>
              <button className="editProfile-btn" type="submit" value="signup">
                Update account
              </button>
            </form>
          </div>
        </div>
      </>
    );
  }
}
let mapStateToProps = state => {
  return {
    lgin: state.loggedIn,
    currentUser: state.user
  };
};
let EditProfile = connect(mapStateToProps)(UnconnectedEditProfile);

export default EditProfile;
