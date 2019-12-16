import React, { Component } from "react";
import { connect } from "react-redux";
import { Link, Redirect } from "react-router-dom";
import LoadingOverlay from "react-loading-overlay";
import { FaMapMarkerAlt, FaAngleDown, FaWindowClose } from "react-icons/fa";
import SelectDateTime from "./SelectDateTime.jsx";

import "../css/parkingDetails.css";

class UnconnectedParkingDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      strAddressarray: [],
      loading: true
    };
  }

  componentDidMount = () => {
    this.getPostDetails(this.props.postID);
    setTimeout(() => {
      this.setState({
        loading: false
      });
    }, 1500);
  };

  getPostDetails = async postID => {
    let response = await fetch("/getPost?id=" + postID);
    let responseBody = await response.text();
    let body = JSON.parse(responseBody);
    console.log("post details", body);
    if (body.success) {
      console.log("postDetails data:", body.data);

      this.props.dispatch({
        type: "set-parkingLot-details",
        parkingLotDetail: body.data
      });
    } else {
      alert(body.message);
    }
  };

  getStart = () => {
    let _date = Date.parse(this.props.parkingLotDetail.availableStart);

    let date = new Date(_date);

    let timeStr = date.toTimeString().replace(/.*(\d{2}:\d{2}:\d{2}).*/, "$1");
    return timeStr;
  };

  getEnd = () => {
    let _date = Date.parse(this.props.parkingLotDetail.availableEnd);

    let date = new Date(_date);

    let timeStr = date.toTimeString().replace(/.*(\d{2}:\d{2}:\d{2}).*/, "$1");
    return timeStr;
  };

  checkout = () => {
    if (!this.props.lgin) {
      return <Redirect to="/login" />;
    }
    if (this.props.lgin) {
      return <Redirect to="/checkOut" />;
    }
  };

  render() {
    return (
      <>
        {this.state.loading ? (
          <LoadingOverlay
            active={this.state.loading}
            spinner
            text="Loading your content..."
            styles={{
              wrapper: {
                width: "100%",
                height: "100%",
                overflow: this.state.loading ? "hidden" : "scroll"
              }
            }}
          ></LoadingOverlay>
        ) : (
          <div className="parkingDetails-container">
            <div className="parkingDetails-row">
              <img src={"../.." + this.props.parkingLotDetail.fileURL}></img>
              <div className="parkingDetails-right-child">
                <div className="parkingDetails-price-container">
                  <div className="parkingDetails-price">
                    Hourly rate: $
                    {parseFloat(this.props.parkingLotDetail.price).toFixed(2)}
                  </div>
                  <div className="parkingDetails-dailyPrice">
                    Daily rate: $
                    {parseFloat(this.props.parkingLotDetail.dailyPrice).toFixed(
                      2
                    )}
                  </div>
                  {this.props.parkingLotDetail.monthly === "true" ? (
                    <div className="parkingDetails-Monthly">
                      Monthly rate: $
                      {parseFloat(
                        this.props.parkingLotDetail.monthlyPrice
                      ).toFixed(2)}
                    </div>
                  ) : (
                    ""
                  )}
                </div>
                <div className="parkingDetails-address">
                  {this.props.parkingLotDetail.address.split(",").map(str => {
                    return <div>{str}</div>;
                  })}
                </div>
                <div className="parkingDetails-qty-container">
                  <div className="parkingDetails-title">
                    Parking Spaces left
                  </div>
                  <strong> {this.props.parkingLotDetail.parkingQty}</strong>
                </div>
                <div className="parkingDetails-hours">
                  <div className="parkingDetails-title">Hours of operation</div>
                  {this.getStart() + "   TO   " + this.getEnd()}
                </div>
              </div>
            </div>
            <div className="parkingDetails-row-bottom">
              <div className="parkingDetails-description">
                <div className="parkingDetails-description-title">
                  Description
                </div>
                <p>{this.props.parkingLotDetail.description}</p>
              </div>
              <div>
                <Link to="/checkOut">
                  <button className="checkOut_btn" value="login">
                    Purchase
                  </button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </>
    );
  }
}

let mapStateToProps = state => {
  return {
    lgin: state.loggedIn,
    parkingLotDetail: state.parkingLotDetail
  };
};

let ParkingDetails = connect(mapStateToProps)(UnconnectedParkingDetails);

export default ParkingDetails;
