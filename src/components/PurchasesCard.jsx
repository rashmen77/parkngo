import React, { Component } from "react";
import { connect } from "react-redux";
import QRCode from "qrcode.react";
import { Link, Redirect } from "react-router-dom";

class UnconnectedPurchasesCard extends Component {
  /**
   * download QR code
   */
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
      <div className="purchaseCard-container">
        <div className="purchaseCard-qrcode">
          <div>
            <QRCode
              id="checkOut-qrcode"
              value={this.props.purchase.qrcodeValue}
              size={220}
              level={"H"}
              includeMargin={true}
            />
          </div>
          <div>
            <a onClick={this.downloadQR}> Download QR </a>
          </div>
        </div>
        <div className="purchasesCard-text-container">
          <div className="purchaseCard-amt">
            ${parseFloat(this.props.purchase.purchaseAmt).toFixed(2)}
          </div>
          <div>
            <Link to={"/postDetails/" + this.props.purchase.postID}>
              Parking details
            </Link>
          </div>
        </div>
      </div>
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
let PurchasesCard = connect(mapStateToProps)(UnconnectedPurchasesCard);

export default PurchasesCard;
