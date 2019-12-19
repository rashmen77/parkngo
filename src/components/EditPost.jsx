import React, { Component } from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import DatePicker from "react-datepicker";
import ReactMapGL, { Marker } from "react-map-gl";
import { FaAngleDown } from "react-icons/fa";
import { FaMapMarkerAlt, FaFileImage } from "react-icons/fa";

import "../css/listProperty.css";

let authData = require("../../AuthData.js");
let MAPBOX_TOKEN = authData.MAPBOX_TOKEN;

class UnconnectedEditPost extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dailyPrice: 0,
      monthlyPrice: 0,
      monthly: false,
      availStartDateTime: new Date(),
      availEndDateTime: new Date(),
      post: [],
      loading: true,
      parkingQty: 0,
      description: "",
      price: 0,
      postComplete: false,
      file: "",
      endDay: "",
      endTime: "",
      preview: "",
      searchResultLayer: [],
      marker: false,
      result: undefined,
      viewport: {
        width: 565,
        height: 280,
        latitude: 45.508888,
        longitude: -73.561668,
        zoom: 12
      }
    };
  }
  MAPBOX_TOKEN =
    "pk.eyJ1IjoicmFzaHNpdmE3NyIsImEiOiJjazN0MjR3MzcwZGUxM211aTBjanFiM3Q0In0.WnNe0New65UY1pzvaC-Njg";

  changeAddress = async evt => {
    let response = await fetch(
      "https://api.mapbox.com/geocoding/v5/mapbox.places/{" +
        evt.target.value +
        "}.json?access_token=" +
        MAPBOX_TOKEN +
        "&cachebuster=1575661747524&autocomplete=true"
    );
    let responseBody = await response.json();

    this.setState({
      searchResultLayer: responseBody.features
    });
  };

  SearchToCoordinate = _result => {
    this.setState({
      result: _result,
      marker: true,
      viewport: {
        width: 565,
        height: 280,
        latitude: _result.geometry.coordinates[1],
        longitude: _result.geometry.coordinates[0],
        zoom: 14
      }
    });
  };

  renderRedirect = () => {
    if (!this.props.lgin) {
      return <Redirect to="/login" />;
    }
    if (this.state.postComplete) {
      return <Redirect to="/userPosts" />;
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

  onChangePrice = event => {
    this.setState({
      price: event.target.value
    });
  };
  onChangeParkingType = event => {
    this.setState({
      parkingType: event.target.value
    });
  };
  getCheckboxStatus = () => {
    this.setState({
      monthly: !this.state.monthly
    });
  };

  onChangeDailyPrice = event => {
    this.setState({
      dailyPrice: event.target.value
    });
  };

  onChangeParkingQty = event => {
    this.setState({
      parkingQty: event.target.value
    });
  };

  onChaneDescription = event => {
    this.setState({
      description: event.target.value
    });
  };

  onChangeMonthlyPrice = event => {
    this.setState({
      monthlyPrice: event.target.value
    });
  };

  setStartDateTime = date => {
    this.setState({
      availStartDateTime: date
    });
  };

  setEndDateTime = date => {
    this.setState({
      availEndDateTime: date
    });
  };

  updatePost = async () => {
    event.preventDefault();
    let data = new FormData();

    data.append("postID", this.props.originalPost._id);
    data.append("userID", this.props.originalPost.userId);

    data.append("file", this.state.file);

    data.append("address", this.state.result.place_name);
    data.append("address_id", this.state.result.id);
    data.append("lat", this.state.result.geometry.coordinates[1]);
    data.append("lng", this.state.result.geometry.coordinates[0]);

    data.append("availableStart", this.state.availStartDateTime);
    data.append("availableEnd", this.state.availEndDateTime);

    data.append("price", this.state.price);

    data.append("description", this.state.description);

    data.append("parkingQty", this.state.parkingQty);
    data.append("dailyPrice", this.state.dailyPrice);

    let response = await fetch("/editPost", {
      method: "POST",
      body: data
    });
    let responseBody = await response.text();
    let body = JSON.parse(responseBody);
    console.log("subtmit post ", body);
    if (!body.success) {
      alert("post failure");
      return;
    } else {
      alert("Post sent");
      this.setState({
        postComplete: true
      });
    }
  };

  render() {
    return (
      <>
        {this.renderRedirect()}
        <div className="listProperty-container">
          <h2>Update your post</h2>
          <div className="listProperty-addressContainer">
            <div className="listProperty-sectionLabel">Address</div>
            <input
              className="listProperty-inputAddress"
              type="text"
              onChange={this.changeAddress}
              placeholder="Update Address"
            ></input>

            {this.state.searchResultLayer.map(result => {
              return (
                <div>
                  <button
                    onClick={() => this.SearchToCoordinate(result)}
                    className="listProperty-searchResult"
                  >
                    {result.place_name.substring(0, 30)}
                  </button>
                </div>
              );
            })}
            <div className="listProperty-mapbox">
              <ReactMapGL
                className="listProperty-map"
                mapboxApiAccessToken={MAPBOX_TOKEN}
                mapStyle="mapbox://styles/rashsiva77/ck3tg4jtv12ss1cs4txn1vcpp"
                {...this.state.viewport}
                onViewportChange={viewport => this.setState({ viewport })}
              >
                {this.state.marker ? (
                  <Marker
                    key={this.state.result.id}
                    latitude={this.state.result.geometry.coordinates[1]}
                    longitude={this.state.result.geometry.coordinates[0]}
                  >
                    <FaMapMarkerAlt className="listProperty-markerIcon"></FaMapMarkerAlt>
                  </Marker>
                ) : (
                  ""
                )}
              </ReactMapGL>
            </div>
          </div>
          <div className="listProperty-mediaContainer">
            <div className="listProperty-sectionLabel">Media</div>
            <div className="listProperty-mediaUpload">
              <div className="listProperty-preview">
                {this.state.file ? (
                  <img
                    className="listProperty-loadPreview"
                    src={this.state.preview}
                  />
                ) : (
                  <FaFileImage className="listProperty-defaultdPreview" />
                )}
              </div>
              <input
                className="listProperty-button "
                type="file"
                onChange={this.handleFile}
              />
            </div>
          </div>

          <div className="listProperty-availability">
            <div className="listProperty-sectionLabel">Hours of operation</div>
            <div className="listProperty-selector">
              <div className="listProperty-arriving">
                <DatePicker
                  className="listProperty-startDateTime"
                  selected={this.state.availStartDateTime}
                  onChange={date => this.setStartDateTime(date)}
                  showTimeSelect
                  showTimeSelectOnly
                  timeFormat="HH:mm"
                  timeIntervals={60}
                  timeCaption="time"
                  dateFormat="h:mm aa"
                />
                <FaAngleDown className="downIcon"></FaAngleDown>
              </div>
              <div className="listProperty-leaving">
                <DatePicker
                  className="listProperty-endDateTime "
                  selected={this.state.availEndDateTime}
                  onChange={date => this.setEndDateTime(date)}
                  showTimeSelect
                  showTimeSelectOnly
                  timeFormat="HH:mm"
                  timeIntervals={60}
                  timeCaption="time"
                  dateFormat="h:mm aa"
                />
                <FaAngleDown className="downIcon"></FaAngleDown>
              </div>
            </div>
          </div>

          <div className="listProperty-details">
            <div className="listProperty-sectionLabel">Details</div>
            <div className="listProperty-details-row">
              <div className="listProperty-monthly">
                <label>Monthly :</label>
                <input
                  className="listProperty-price-monthly"
                  type="checkbox"
                  onChange={this.getCheckboxStatus}
                ></input>
              </div>
              {this.state.monthly ? (
                <div className="listProperty-monthly-container">
                  <h3>Monthly rate</h3>
                  <input
                    className="listProperty-detail-input"
                    type="text"
                    onChange={this.onChangeMonthlyPrice}
                    placeholder="Dollars"
                  ></input>
                </div>
              ) : (
                ""
              )}
            </div>

            <div className="listProperty-qty">
              <h3>Space available</h3>
              <input
                onChange={this.onChangeParkingQty}
                className="listProperty-detail-input"
                type="number"
                placeholder="Quantity"
                min="1"
              ></input>
            </div>

            <div className="listProperty-price">
              <h3>Price per hour </h3>
              <input
                className="listProperty-detail-input"
                type="text"
                onChange={this.onChangePrice}
                placeholder="Dollars"
              ></input>
            </div>
            <div className="listProperty-price">
              <h3>Price per Day </h3>
              <input
                className="listProperty-detail-input"
                type="text"
                onChange={this.onChangeDailyPrice}
                placeholder="Dollars"
              ></input>
            </div>
            <div className="listProperty-description">
              <h3>Description</h3>
              <textarea
                placeholder="text here"
                onChange={this.onChaneDescription}
              ></textarea>
            </div>
          </div>
          <div className="listProperty-submit">
            <button
              className="listProperty-submit-btn"
              onClick={this.updatePost}
            >
              Update post
            </button>
          </div>
        </div>
      </>
    );
  }
}

let mapStateToProps = state => {
  return {
    lgin: state.loggedIn,
    originalPost: state.editPost
  };
};
let EditPost = connect(mapStateToProps)(UnconnectedEditPost);

export default EditPost;
