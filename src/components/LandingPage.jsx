import React, { Component, useState } from "react";
import { FaParking, FaMapMarkerAlt, FaAngleDown } from "react-icons/fa";

import { Link } from "react-router-dom";

import { connect } from "react-redux";
import ReactMapGL, { Marker, Popup } from "react-map-gl";

import SelectDateTime from "./SelectDateTime.jsx";

import "react-datepicker/dist/react-datepicker.css";

import "../css/landingPage.css";

class UnconnectedLandingPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hourlyDaily: true,
      monthly: false,
      hourlyDailyStyle: {
        paddingBottom: "5px",
        borderBottom: "2px solid var(--fontlight)",
        borderRadius: 0
      },
      monthlyStyle: {
        paddingBottom: "5px"
      },
      parkingPost: null,
      posts: [],
      searchResultLayer: [],
      viewport: {
        width: 700,
        height: 500,
        latitude: 45.508888,
        longitude: -73.561668,
        zoom: 12
      }
    };
  }

  componentDidMount = async () => {
    let response = await fetch("/allPosts");
    let responseBody = await response.text();
    let body = JSON.parse(responseBody);
    if (body.success) {
      console.log("all posts retrieved ", body);
      this.setState({
        posts: body.data
      });
    } else {
      console.log("all posts retrieved failure ", body);
    }
  };

  MAPBOX_TOKEN =
    "pk.eyJ1IjoicmFzaHNpdmE3NyIsImEiOiJjazN0MjR3MzcwZGUxM211aTBjanFiM3Q0In0.WnNe0New65UY1pzvaC-Njg";

  arrival = () => {
    this.setState({ arrivalBtn: !this.state.arrivalBtn });
  };

  leaving = () => {
    this.setState({ leavingBtn: !this.state.leavingBtn });
  };

  locationSearch = async evt => {
    let response = await fetch(
      "https://api.mapbox.com/geocoding/v5/mapbox.places/{" +
        evt.target.value +
        "}.json?access_token=" +
        this.MAPBOX_TOKEN +
        "&cachebuster=1575661747524&autocomplete=true"
    );
    let responseBody = await response.json();
    console.log("responseBody", responseBody.features[0]);
    this.setState({
      searchResultLayer: responseBody.features
    });
  };

  SearchToCoordinate = result => {
    console.log("handleParkingAddress on landingPage", result);
    this.props.dispatch({
      type: "Search-address-data",
      value: result
    });
  };

  handelSearch = () => {
    this.props.dispatch({
      type: "target-coordinates",
      value: this.props.targetAddress.geometry.coordinates,
      monthly: this.state.monthly
    });
  };

  handelSearchWithNoData = () => {
    this.props.dispatch({
      type: "default-search",
      monthly: this.state.monthly
    });
  };

  setSelectedParking = parking => {
    this.setState({
      parkingPost: parking
    });
  };

  getBrowserLocation = () => {};

  setHourlyDaily = () => {
    this.setState({
      monthly: false,
      hourlyDaily: true,
      hourlyDailyStyle: {
        paddingBottom: "5px",
        borderBottom: "2px solid var(--fontlight)",
        borderRadius: 0
      },
      monthlyStyle: { paddingBottom: "5px" }
    });
  };

  setMonthly = () => {
    this.setState({
      monthly: true,
      hourlyDaily: false,
      monthlyStyle: {
        paddingBottom: "5px",
        borderBottom: "2px solid var(--fontlight)",
        borderRadius: 0
      },
      hourlyDailyStyle: { paddingBottom: "5px" }
    });
  };

  render() {
    return (
      <div className="searchMap-container">
        <div className="searchParking">
          <div className="searchTitle">
            <div className="hourAndDaily">
              <button
                style={this.state.hourlyDailyStyle}
                onClick={this.setHourlyDaily}
              >
                <h1>HOURLY/DAILY</h1>
              </button>
            </div>
            <div className="monthly">
              <button style={this.state.monthlyStyle} onClick={this.setMonthly}>
                <h1>MONTHLY</h1>
              </button>
            </div>
          </div>
          <div className="searchLocation">
            <div className="locationContainer">
              <div className="locationLabel">PARKING AT</div>
              {this.props.targetAddress === undefined ? (
                <input
                  className="inputLocation"
                  type="text"
                  onChange={this.locationSearch}
                  placeholder="Where do you want to park?"
                ></input>
              ) : (
                <input
                  className="inputLocation"
                  type="text"
                  value={this.props.targetAddress.place_name}
                  onChange={this.locationSearch}
                  placeholder="Where do you want to park?"
                ></input>
              )}

              <FaMapMarkerAlt
                onClick={this.getBrowserLocation}
                className="mapIcon"
              />

              {this.state.searchResultLayer.map(result => {
                return this.props.targetAddress === undefined ? (
                  <div>
                    <button
                      onClick={() => this.SearchToCoordinate(result)}
                      className="searchResult"
                    >
                      {result.place_name.substring(0, 30)}
                    </button>
                  </div>
                ) : (
                  ""
                );
              })}
            </div>
          </div>
          {/* <div className="dateTimeBox">
            <SelectDateTime></SelectDateTime>
          </div> */}
          <div className="submitSearch">
            <Link to="/searchResults">
              {this.props.targetAddress === undefined ? (
                <button
                  onClick={() => {
                    this.handelSearchWithNoData();
                  }}
                  className="submitBtn"
                >
                  Search for Parking
                </button>
              ) : (
                <button
                  onClick={() => {
                    this.handelSearch();
                  }}
                  className="submitBtn"
                >
                  Search for Parking
                </button>
              )}
            </Link>
          </div>
        </div>
        <div className="map_box">
          <ReactMapGL
            onClick={() => {
              this.setSelectedParking(null);
            }}
            className="map_box_map"
            mapboxApiAccessToken={this.MAPBOX_TOKEN}
            mapStyle="mapbox://styles/rashsiva77/ck3tg4jtv12ss1cs4txn1vcpp"
            {...this.state.viewport}
            onViewportChange={viewport => this.setState({ viewport })}
          >
            {this.state.posts.map(parkingSpot => {
              return (
                <Marker
                  key={parkingSpot.addressID}
                  latitude={parseFloat(parkingSpot.lat)}
                  longitude={parseFloat(parkingSpot.lng)}
                >
                  <button
                    className="landingPage-marker-btn"
                    onClick={e => {
                      e.preventDefault();
                      this.setSelectedParking(parkingSpot);
                    }}
                  >
                    <FaParking className="landingPage-marker-Icon"></FaParking>
                  </button>
                </Marker>
              );
            })}
            {this.state.parkingPost ? (
              <Popup
                className="map-popup"
                latitude={parseFloat(this.state.parkingPost.lat)}
                longitude={parseFloat(this.state.parkingPost.lng)}
              >
                <div className="map-popup-container">
                  <p>{this.state.parkingPost.address}</p>
                  <h3>
                    ${parseFloat(this.state.parkingPost.price).toFixed(2)}/hour
                  </h3>
                  <Link
                    className="details-link"
                    to={"/postDetails/" + this.state.parkingPost._id}
                  >
                    Details
                  </Link>
                </div>
              </Popup>
            ) : null}
          </ReactMapGL>
        </div>
      </div>
    );
  }
}
let mapStateToProps = state => {
  return {
    startDateTime: state.startDateTime,
    arrivalTime: state.arrivalTime,
    leavingDate: state.leavingDate,
    leavingTime: state.leavingTime,
    targetAddress: state.searchAddData
  };
};
let LandingPage = connect(mapStateToProps)(UnconnectedLandingPage);

export default LandingPage;
