import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { FaWindowClose, FaEdit } from "react-icons/fa";

import "../css/parkingCard.css";

class UnconnectedParkingCard extends Component {
  remove = async () => {
    let response = await fetch("/deletePost?id=" + this.props.post._id);
    let responseBody = await response.text();
    let body = JSON.parse(responseBody);
    if (body.success) {
      alert(body.message);
    } else {
      alert(body.message);
    }
  };

  setEditPost = post => {
    this.props.dispatch({
      type: "set-editpost",
      value: post
    });
  };

  render() {
    return (
      <div className="parkingCard-container">
        <div className="img-container">
          <img src={"../.." + this.props.post.fileURL}></img>
        </div>
        <div className="parkingCard-text-Container">
          <div className="parkingCard-address">
            <p>{this.props.post.address.substring(0, 25)}</p>
          </div>
          <div className="parkingCard-price">
            <span> ${parseFloat(this.props.post.price).toFixed(2)}/hr</span>
          </div>
          <div>
            <FaWindowClose
              style={{ cursor: "pointer" }}
              onClick={this.remove}
              className="closeIcon"
            ></FaWindowClose>
          </div>
          <div>
            <Link to={"/editPost/" + this.props.post._id}>
              <FaEdit
                onClick={() => {
                  this.setEditPost(this.props.post);
                }}
                className="editIcon"
              ></FaEdit>
            </Link>
          </div>
        </div>
      </div>
    );
  }
}
let mapStateToProps = state => {
  return { lgin: state.loggedIn };
};
let ParkingCard = connect(mapStateToProps)(UnconnectedParkingCard);

export default ParkingCard;
