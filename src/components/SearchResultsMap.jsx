import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import ReactMapGL, { Marker, Popup } from "react-map-gl";
import { FaParking, FaMapMarkerAlt } from "react-icons/fa";

let authData = require("../../AuthData.js");

let MAPBOX_TOKEN = authData.MAPBOX_TOKEN;

class UnconnectedSearchResultsMap extends Component {
  constructor(props) {
    super(props);
    this.state = {
      posts: [],
      parkingPost: null,
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight,
        latitude: this.props._lat,
        longitude: this.props._lng,
        zoom: 16
      }
    };
  }

  componentDidMount = async () => {
    let query = "";

    if (this.props.monthlySearch === true) {
      query = "?monthly=true";
    }

    let response = await fetch("/allPosts" + query);
    let responseBody = await response.text();
    let body = JSON.parse(responseBody);
    if (body.success) {
      this.setState({
        posts: body.data
      });
    } else {
      console.log("all posts retrieved failure ", body);
    }
  };

  MAPBOX_TOKEN =
    "pk.eyJ1IjoicmFzaHNpdmE3NyIsImEiOiJjazN0MjR3MzcwZGUxM211aTBjanFiM3Q0In0.WnNe0New65UY1pzvaC-Njg";

  setSelectedParking = parking => {
    this.setState({
      parkingPost: parking
    });
  };

  render() {
    return (
      <div className="Map_box">
        <ReactMapGL
          onClick={() => {
            this.setSelectedParking(null);
          }}
          mapboxApiAccessToken={MAPBOX_TOKEN}
          mapStyle="mapbox://styles/rashsiva77/ck3tg4jtv12ss1cs4txn1vcpp"
          {...this.state.viewport}
          onViewportChange={viewport => this.setState({ viewport })}
        >
          {this.state.posts.map(parkingSpot => {
            return (
              <>
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
              </>
            );
          })}
          {this.props.addressData === undefined ? (
            ""
          ) : (
            <Marker
              key={this.props.addressData.place_name}
              latitude={this.props.addressData.center[1]}
              longitude={this.props.addressData.center[0]}
            >
              <div className="map-textIcon-container">
                <div className="map-text">You are here</div>
                <FaMapMarkerAlt className="youarehere-Icon"></FaMapMarkerAlt>
              </div>
            </Marker>
          )}

          {this.state.parkingPost ? (
            <Popup
              className="map-popup"
              latitude={parseFloat(this.state.parkingPost.lat)}
              longitude={parseFloat(this.state.parkingPost.lng)}
            >
              <div className="map-popup-container">
                <p>{this.state.parkingPost.address.substring(0, 30)}</p>
                <h3>
                  Daily rate: $
                  {parseFloat(this.state.parkingPost.dailyPrice).toFixed(2)}
                </h3>
                {this.state.parkingPost.monthly === "true" ? (
                  <h3>
                    {"Monthly rate: $" +
                      parseFloat(this.state.parkingPost.dailyPrice).toFixed(2)}
                  </h3>
                ) : (
                  ""
                )}
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
    );
  }
}
let mapStateToProps = state => {
  return {
    _lat: state.searchLat,
    _lng: state.searchLng,
    addressData: state.searchAddData,
    monthlySearch: state.monthlySearch
  };
};
let SearchResultsMap = connect(mapStateToProps)(UnconnectedSearchResultsMap);

export default SearchResultsMap;
