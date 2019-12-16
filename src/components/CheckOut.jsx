import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";
import ReactMapGL, { Marker } from "react-map-gl";
import { FaMapMarkerAlt } from "react-icons/fa";
import TotalDetails from "./Totaldetails.jsx";
import StripeCheckout from "react-stripe-checkout";
import QRCode from "qrcode.react";

import "../css/checkOut.css";

class UnconnectedCheckOut extends Component {
  constructor(props) {
    super(props);
    this.state = {
      qrCode: false,
      qrcodeValue: 0,
      daily: true,
      monthly: false,
      hourlyDailyStyle: {
        paddingBottom: "5px",
        borderBottom: "2px solid var(--fontlight)",
        borderRadius: 0
      },
      monthlyStyle: {
        paddingBottom: "5px"
      },
      viewport: {
        width: 565,
        height: 280,
        latitude: parseFloat(this.props.parkingLotDetail.lat),
        longitude: parseFloat(this.props.parkingLotDetail.lng),
        zoom: 16
      }
    };
  }

  generateCode = () => {
    return "" + Math.floor(Math.random() * 100000000);
  };

  MAPBOX_TOKEN =
    "pk.eyJ1IjoicmFzaHNpdmE3NyIsImEiOiJjazN0MjR3MzcwZGUxM211aTBjanFiM3Q0In0.WnNe0New65UY1pzvaC-Njg";

  checkLoggedin = () => {
    if (!this.props.lgin) {
      return <Redirect to="/login" />;
    }
  };

  setDaily = () => {
    this.setState({
      monthly: false,
      daily: true,
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

  submitPay = async () => {
    let _qty = parseInt(this.props.parkingLotDetail.parkingQty);
    let _ownerID = this.props.parkingLotDetail.userId;
    let _amt = 0;
    let _currentUsr = this.props.currentUsr._id;
    let _qrcodeValue = this.generateCode();

    this.props.parkingLotDetail.monthly === "true"
      ? (_amt = parseInt(this.props.parkingLotDetail.monthlyPrice) * 1.14975)
      : (_amt = parseInt(this.props.parkingLotDetail.dailyPrice) * 1.14975);

    if (_qty <= 0) {
      alert("No more Parking spaces left");
      return;
    } else {
      _qty = _qty - 1;
    }

    let data = new FormData();

    data.append("newQty", _qty);
    data.append("ownerID", _ownerID);
    data.append("totalamt", _amt);
    data.append("buyerID", _currentUsr);
    data.append("qrcodeValue", _qrcodeValue);

    let response = await fetch(
      "/updateQtyAndToPurchases?postID=" + this.props.parkingLotDetail._id,
      { method: "POST", body: data }
    );
    let responseBody = await response.text();
    let body = JSON.parse(responseBody);

    if (body.success) {
      this.setState({
        qrCode: true,
        qrcodeValue: _qrcodeValue
      });
    } else {
      alert(body.message);
    }
  };

  downloadQR = () => {
    const canvas = document.getElementById("checkOut-qrcode");
    const pngUrl = canvas
      .toDataURL("image/png")
      .replace("image/png", "image/octet-stream");
    let downloadLink = document.createElement("a");
    downloadLink.href = pngUrl;
    downloadLink.download = "ParknGo-QRCode.png";
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  render() {
    return (
      <>
        {this.checkLoggedin()}
        <div className="checkOut-container">
          <div className="checkOut-centerContainer">
            <div className="checkOut-Mapbox">
              <ReactMapGL
                className="listProperty-map"
                mapboxApiAccessToken={this.MAPBOX_TOKEN}
                mapStyle="mapbox://styles/rashsiva77/ck3tg4jtv12ss1cs4txn1vcpp"
                {...this.state.viewport}
                onViewportChange={viewport => this.setState({ viewport })}
              >
                <Marker
                  key={this.props.parkingLotDetail.addressID}
                  latitude={parseFloat(this.props.parkingLotDetail.lat)}
                  longitude={parseFloat(this.props.parkingLotDetail.lng)}
                >
                  <FaMapMarkerAlt className="listProperty-markerIcon"></FaMapMarkerAlt>
                </Marker>
              </ReactMapGL>
            </div>
            <div className="checkOut-total">
              <div className="checkOut-title">
                <div className="checkOut-Daily">
                  <button
                    style={this.state.hourlyDailyStyle}
                    onClick={this.setDaily}
                  >
                    <h1>DAILY</h1>
                  </button>
                </div>
                {this.props.parkingLotDetail.monthly === "true" ? (
                  <div className="checkOut-monthly">
                    <button
                      style={this.state.monthlyStyle}
                      onClick={this.setMonthly}
                    >
                      <h1>MONTHLY</h1>
                    </button>
                  </div>
                ) : (
                  ""
                )}
              </div>
              {this.state.monthly ? (
                <TotalDetails
                  subTotal={parseFloat(
                    this.props.parkingLotDetail.monthlyPrice
                  )}
                ></TotalDetails>
              ) : (
                <TotalDetails
                  subTotal={parseFloat(this.props.parkingLotDetail.dailyPrice)}
                ></TotalDetails>
              )}
              <div className="checkOut-btn">
                <StripeCheckout
                  style={{
                    width: "300px"
                  }}
                  token={this.submitPay}
                  amount={
                    this.state.monthly
                      ? parseInt(this.props.parkingLotDetail.monthlyPrice) *
                        1.14975 *
                        100
                      : parseInt(this.props.parkingLotDetail.dailyPrice) *
                        1.14975 *
                        100
                  }
                  stripeKey="pk_test_IHCci5JpsfNDpguiMOlvomHn00ebvGm0Cs"
                />
              </div>
              <div className="checkOut-QRcode">
                {this.state.qrCode ? (
                  <>
                    <QRCode
                      id="checkOut-qrcode"
                      value={this.state.qrcodeValue}
                      size={290}
                      level={"H"}
                      includeMargin={true}
                    />
                    <a onClick={this.downloadQR}> Download QR </a>
                  </>
                ) : (
                  ""
                )}
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}
let mapStateToProps = state => {
  return {
    lgin: state.loggedIn,
    parkingLotDetail: state.parkingLotDetail,
    currentUsr: state.user
  };
};
let CheckOut = connect(mapStateToProps)(UnconnectedCheckOut);

export default CheckOut;
