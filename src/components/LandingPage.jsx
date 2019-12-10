import React, { Component } from "react";
import { FaMapMarkerAlt, FaAngleDown } from "react-icons/fa";
import ArrivalDateTime from "./ArrivalDateTime.jsx";
import { Link } from "react-router-dom";
import LeavingDateTime from "./LeavingDateTime.jsx";
import { connect } from "react-redux";
import ReactMapGL from "react-map-gl";
import Geocode from "react-geocode";

import "../css/landingPage.css";
// Geocode.setApiKey("AIzaSyDDwEsQTNemIFXsrvLRM4B5CqKOtCY8FFs");
// Geocode.setLanguage("en");
// Geocode.setRegion("es");
// Geocode.enableDebug();
// Geocode.fromAddress("Eiffel Tower").then(
//   response => {
//     const { lat, lng } = response.results[0].geometry.location;
//     console.log(lat, lng);
//   },
//   error => {
//     console.error(error);
//   }
// );

class UnconnectedLandingPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      posts: [],
      arrivalBtn: false,
      leavingBtn: false,
      searchResultLayer: [],
      viewport: {
        width: 800,
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
      value: this.props.targetAddress.geometry.coordinates
    });
  };

  render() {
    return (
      <div className="searchMap-container">
        <div className="searchParking">
          <div className="searchTitle">
            <div className="hourAndDaily">
              <h2>HOURLY/DAILY</h2>
            </div>
            <div className="monthly">
              <h2>MONTLY</h2>
            </div>
          </div>
          <div className="searchLocation">
            <div className="locationContainer">
              <div className="locationLabel">PARKING AT</div>
              <input
                id="autocomplete"
                className="inputLocation"
                type="text"
                onChange={this.locationSearch}
                // value={
                //   this.props.targetAddress === undefined
                //     ? ""
                //     : this.props.targetAddress.place_name
                // }
                placeholder="Where do you want to park?"
              ></input>
              <FaMapMarkerAlt className="mapIcon" />
              {this.state.searchResultLayer.map(result => {
                return (
                  <div>
                    <button
                      onClick={() => this.SearchToCoordinate(result)}
                      className="searchResult"
                    >
                      {result.place_name.substring(0, 30)}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="dateTimeBox">
            <div className="arriving">
              <button className="arrivalBtn" onClick={this.arrival}>
                <div>
                  {this.props.arrivalDate.toDateString()}
                  <FaAngleDown className="downIcon" />
                </div>
                <div>{this.props.arrivalTime}</div>
              </button>
            </div>
            <div className="leaving">
              <button className="leavingBtn" onClick={this.leaving}>
                <div>
                  {this.props.leavingDate.toDateString()}
                  <FaAngleDown className="downIcon" />
                </div>
                <div>{this.props.leavingTime}</div>
              </button>
            </div>
          </div>
          <div className="submitSearch">
            <Link to="/searchResults">
              <button
                onClick={() => {
                  this.handelSearch();
                }}
                className="submitBtn"
              >
                Search for Parking
              </button>
            </Link>
          </div>
          {this.state.arrivalBtn ? (
            <>
              <div className="locationLabel">Arriving</div>
              <ArrivalDateTime></ArrivalDateTime>
            </>
          ) : (
            <></>
          )}
          {this.state.leavingBtn ? (
            <>
              <div className="locationLabel">Leaving</div>{" "}
              <LeavingDateTime></LeavingDateTime>{" "}
            </>
          ) : (
            <></>
          )}
        </div>
        <div className="map_box">
          <ReactMapGL
            className="map_box_map"
            mapboxApiAccessToken={this.MAPBOX_TOKEN}
            mapStyle="mapbox://styles/rashsiva77/ck3tg4jtv12ss1cs4txn1vcpp"
            {...this.state.viewport}
            onViewportChange={viewport => this.setState({ viewport })}
          >
            {this.state.posts.map(parkingSpot => {})}
          </ReactMapGL>
        </div>
      </div>
    );
  }
}
let mapStateToProps = state => {
  return {
    arrivalDate: state.arrivalDate,
    arrivalTime: state.arrivalTime,
    leavingDate: state.leavingDate,
    leavingTime: state.leavingTime,
    targetAddress: state.searchAddData
  };
};
let LandingPage = connect(mapStateToProps)(UnconnectedLandingPage);

export default LandingPage;
