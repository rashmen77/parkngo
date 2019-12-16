import React, { Component } from "react";

class Totaldetails extends Component {
  render() {
    return (
      <div className="checkOut-amtContainer">
        <div className="checkOut-row">
          <div className="checkOut-label">SubTotal</div>
          <div className="checkOut-amt">
            ${parseFloat(this.props.subTotal).toFixed(2)}
          </div>
        </div>
        <div className="checkOut-row">
          <div className="checkOut-label">{"Tax(14.975%)"}</div>
          <div className="checkOut-amt">
            ${(parseFloat(this.props.subTotal) * 0.14975).toFixed(2)}
          </div>
        </div>
        <div className="checkOut-row">
          <div className="checkOut-label">Grand Total</div>
          <div className="checkOut-amt">
            ${(parseFloat(this.props.subTotal) * 1.14975).toFixed(2)}
          </div>
        </div>
      </div>
    );
  }
}

export default Totaldetails;
