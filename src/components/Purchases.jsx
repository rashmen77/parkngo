import React, { Component } from "react";
import { connect } from "react-redux";
import PurchasesCard from "./PurchasesCard.jsx";
import LoadingOverlay from "react-loading-overlay";

import "../css/purchases.css";

class UnconnectedPurchases extends Component {
  constructor() {
    super();
    this.state = {
      loading: true,
      allPurchases: []
    };
  }

  componentDidMount = () => {
    this.getAllPurchases();
  };

  renderRedirect = () => {
    if (!this.props.lgin) {
      return <Redirect to="/" />;
    }
  };

  getAllPurchases = async () => {
    let response = await fetch("/getPurchases");
    let responseBody = await response.text();
    let body = JSON.parse(responseBody);
    console.log("post details", body);
    if (body.success) {
      console.log("getAllpurchases data:", body.data);

      this.setState({
        allPurchases: body.data,
        loading: false
      });
    } else {
      alert(body.message);
    }
  };

  render() {
    return (
      <>
        {this.renderRedirect()}
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
          <div className="purchases-container">
            <h2>Previous Purchases</h2>
            {this.state.allPurchases.map(_purchase => {
              return (
                <div>
                  <PurchasesCard purchase={_purchase}></PurchasesCard>
                </div>
              );
            })}
          </div>
        )}
      </>
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
let Purchases = connect(mapStateToProps)(UnconnectedPurchases);

export default Purchases;
