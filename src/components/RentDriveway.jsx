import React, { Component } from "react";
import { connect } from "react-redux";
import { Link, Redirect } from "react-router-dom";
import ReactMapGL, { Marker } from "react-map-gl";
import { FaMapMarkerAlt, FaFileImage } from "react-icons/fa";

import "../css/rentdriveway.css";

class UnconnectedRentDriveway extends Component {
  constructor(props) {
    super(props);
    this.state = {
      price: 0,
      postComplete: false,
      file: "",
      startDay: "Mon",
      startTime: "12:00",
      endDay: "",
      endTime: "",
      preview: "",
      searchResultLayer: [],
      marker: false,
      result: [],
      viewport: {
        width: 560,
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
        this.MAPBOX_TOKEN +
        "&cachebuster=1575661747524&autocomplete=true"
    );
    let responseBody = await response.json();

    this.setState({
      searchResultLayer: responseBody.features
    });
  };

  SearchToCoordinate = _result => {
    console.log(
      "handleParkingAddress on landingPage",
      typeof _result.geometry.coordinates[1]
    );

    this.setState({
      result: _result,
      marker: true,
      viewport: {
        width: 560,
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
      return <Redirect to="/login" />;
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

  onChangeStartDay = event => {
    this.setState({
      startDay: event.target.value
    });
  };
  onChangeStartTime = event => {
    this.setState({
      startTime: event.target.value
    });
  };

  onChangeEndDay = event => {
    this.setState({
      endDay: event.target.value
    });
  };
  onChangeEndTime = event => {
    this.setState({
      endTime: event.target.value
    });
  };

  onChangePrice = event => {
    this.setState({
      price: event.target.value
    });
  };

  submitPost = async () => {
    event.preventDefault();
    let data = new FormData();
    data.append("file", this.state.file);
    data.append("address", this.state.result.place_name);
    data.append(
      "lat",
      JSON.stringify(parseFloat(this.state.result.geometry.coordinates[1]))
    );
    data.append(
      "lng",
      JSON.stringify(parseFloat(this.state.result.geometry.coordinates[0]))
    );
    data.append("startDay", this.state.startDay);
    data.append("startTime", this.state.startTime);
    data.append("endDay", this.state.endDay);
    data.append("endTime", this.state.endTime);
    data.append("price", JSON.stringify(parseFloat(this.state.price)));

    let response = await fetch("/postDriveway", {
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
        <div className="rentDriveway-container">
          <h2>Post Your Ad it's fast and easy</h2>
          <div className="rentDriveway-addressContainer">
            <div className="rentDriveway-sectionLabel">Address</div>
            <input
              className="rentDriveway-inputAddress"
              type="text"
              onChange={this.changeAddress}
              placeholder="Address"
            ></input>

            {this.state.searchResultLayer.map(result => {
              return (
                <div>
                  <button
                    onClick={() => this.SearchToCoordinate(result)}
                    className="rentDriveway-searchResult"
                  >
                    {result.place_name.substring(0, 30)}
                  </button>
                </div>
              );
            })}
            <div className="rentDriveway-mapbox">
              <ReactMapGL
                className="rentDriveway-map"
                mapboxApiAccessToken={this.MAPBOX_TOKEN}
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
                    <FaMapMarkerAlt className="rentDriveway-markerIcon"></FaMapMarkerAlt>
                  </Marker>
                ) : (
                  ""
                )}
              </ReactMapGL>
            </div>
          </div>
          <div className="rentDriveway-mediaContainer">
            <div className="rentDriveway-sectionLabel">Media</div>
            <div className="rentDriveway-mediaUpload">
              <div className="rentDriveway-preview">
                {this.state.file ? (
                  <img
                    className="rentDriveway-loadPreview"
                    src={this.state.preview}
                  />
                ) : (
                  <FaFileImage className="rentDriveway-defaultdPreview" />
                )}
              </div>
              <input
                className="rentDriveway-button "
                type="file"
                onChange={this.handleFile}
              />
            </div>
          </div>

          <div className="rentDriveway-availability">
            <div className="rentDriveway-sectionLabel">Availability</div>
            <div className="availability-container">
              <div className="availability-day">
                <select
                  onChange={this.onChangeStartDay}
                  className="availability-day-select"
                  size="7"
                >
                  <option value="Mon">Monday</option>
                  <option value="Tue">Tuesday</option>
                  <option value="Wed">Wednesday</option>
                  <option value="Thu">Thursday</option>
                  <option value="Fri">Friday</option>
                  <option value="Sat">Saturday</option>
                  <option value="Sun">Sunday</option>
                </select>
              </div>
              <div className="availability-time">
                <select
                  onChange={this.onChangeStartTime}
                  className="availability-time-select"
                  size="7"
                >
                  <option value="12:00">12:00</option>
                  <option value="12:30">12:30</option>
                  <option value="13:00">13:00</option>
                  <option value="13:30">13:30</option>
                  <option value="14:00">14:00</option>
                  <option value="14:30">14:30</option>
                  <option value="15:00">15:00</option>
                  <option value="15:30">15:30</option>
                  <option value="16:00">16:00</option>
                  <option value="16:30">16:30</option>
                  <option value="17:00">17:00</option>
                  <option value="17:30">17:30</option>
                  <option value="18:00">18:00</option>
                  <option value="18:30">18:30</option>
                  <option value="19:00">19:00</option>
                  <option value="19:30">19:30</option>
                  <option value="20:00">20:00</option>
                  <option value="20:30">20:30</option>
                  <option value="21:00">21:00</option>
                  <option value="21:30">21:30</option>
                  <option value="22:00">22:00</option>
                  <option value="22:30">22:30</option>
                  <option value="23:00">23:00</option>
                  <option value="23:30">23:30</option>
                  <option value="00:00">00:00</option>
                </select>
              </div>
            </div>
            <div className="availability-seperate">
              <h2>TO</h2>
            </div>
            <div className="availability-container">
              <div className="availability-day">
                <select
                  onChange={this.onChangeEndDay}
                  className="availability-day-select"
                  size="7"
                >
                  <option value="Mon">Monday</option>
                  <option value="Tue">Tuesday</option>
                  <option value="Wed">Wednesday</option>
                  <option value="Thu">Thursday</option>
                  <option value="Fri">Friday</option>
                  <option value="Sat">Saturday</option>
                  <option value="Sun">Sunday</option>
                </select>
              </div>
              <div className="availability-time">
                <select
                  onChange={this.onChangeEndTime}
                  className="availability-time-select"
                  size="7"
                >
                  <option value="12:00">12:00</option>
                  <option value="12:30">12:30</option>
                  <option value="13:00">13:00</option>
                  <option value="13:30">13:30</option>
                  <option value="14:00">14:00</option>
                  <option value="14:30">14:30</option>
                  <option value="15:00">15:00</option>
                  <option value="15:30">15:30</option>
                  <option value="16:00">16:00</option>
                  <option value="16:30">16:30</option>
                  <option value="17:00">17:00</option>
                  <option value="17:30">17:30</option>
                  <option value="18:00">18:00</option>
                  <option value="18:30">18:30</option>
                  <option value="19:00">19:00</option>
                  <option value="19:30">19:30</option>
                  <option value="20:00">20:00</option>
                  <option value="20:30">20:30</option>
                  <option value="21:00">21:00</option>
                  <option value="21:30">21:30</option>
                  <option value="22:00">22:00</option>
                  <option value="22:30">22:30</option>
                  <option value="23:00">23:00</option>
                  <option value="23:30">23:30</option>
                  <option value="00:00">00:00</option>
                </select>
              </div>
            </div>
          </div>

          <div className="rentDriveway-price">
            <div className="rentDriveway-sectionLabel">Price</div>
            <h3>Price per hour: </h3>
            <input
              className="rentDriveway-price-inputAddress"
              type="text"
              onChange={this.onChangePrice}
              placeholder="Dollars"
            ></input>
          </div>
          <div className="rentDriveway-submit">
            <button
              className="rentDriveway-submit-btn"
              onClick={this.submitPost}
            >
              Post
            </button>
          </div>
        </div>
      </>
    );
  }
}

let mapStateToProps = state => {
  return { lgin: state.loggedIn };
};
let RentDriveway = connect(mapStateToProps)(UnconnectedRentDriveway);

export default RentDriveway;
