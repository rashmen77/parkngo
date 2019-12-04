import React, { Component } from "react";

export default class LandingPage extends Component {
  render() {
    return (
      <>
        <div className="searchParking">
          <div className="searchTitle">
            <div>
              <h2>HOURLY/DAILY</h2>
            </div>
            <div>
              <h2>MONTLY</h2>
            </div>
          </div>
          <div className="searchLocation">
            <div>PARKING AT</div>
            <input></input>
          </div>
        </div>
      </>
    );
  }
}
