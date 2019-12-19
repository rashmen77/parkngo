import React, { Component } from "react";
import { connect } from "react-redux";
import { Link, Redirect } from "react-router-dom";
import LoadingOverlay from "react-loading-overlay";

import ParkingCard from "./ParkingCard.jsx";

import "../css/userPosts.css";

//TODO:loading is being dispatched, must be set in state

class UnconnectedUserPosts extends Component {
  constructor() {
    super();
    this.state = {
      loading: true,
      allPosts: []
    };
  }

  componentDidMount = () => {
    this.getAllPosts();
  };

  componentDidUpdate = () => {
    this.getAllPosts();
  };

  renderRedirect = () => {
    if (!this.props.lgin) {
      return <Redirect to="/" />;
    }
  };

  getAllPosts = async () => {
    let response = await fetch("/getUserPosts");
    let responseBody = await response.text();
    let body = JSON.parse(responseBody);
    if (body.success) {
      console.log("getAllPosts data:", body.data);

      this.props.dispatch({
        type: "set-all-userPosts",
        allPosts: body.data,
        loading: false
      });
    } else {
      alert(body.message);
    }
  };

  render() {
    return (
      <>
        {this.renderRedirect()}
        {this.props.loading ? (
          <LoadingOverlay
            active={this.props.loading}
            spinner
            text="Loading your content..."
            styles={{
              wrapper: {
                width: "100%",
                height: "100%",
                overflow: this.props.loading ? "hidden" : "scroll"
              }
            }}
          ></LoadingOverlay>
        ) : (
          <div className="userPosts-container">
            <h2>All posts</h2>
            {this.props.allPosts.map(_post => {
              return (
                <div>
                  <ParkingCard post={_post}></ParkingCard>
                </div>
              );
            })}
          </div>
        )}
      </>
    );
  }
}
let mapStateToProps = state => {
  return {
    lgin: state.loggedIn,
    loading: state.userpostLoading,
    allPosts: state.allPosts
  };
};
let UserPosts = connect(mapStateToProps)(UnconnectedUserPosts);

export default UserPosts;
