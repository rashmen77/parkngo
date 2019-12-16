import React, { Component } from "react";
import { Link } from "react-router-dom";
import "../css/footer.css";
import {
  FaCopyright,
  FaTwitter,
  FaInstagram,
  FaFacebook
} from "react-icons/fa";

export default class Footer extends Component {
  render() {
    return (
      <div className="footer">
        <div className="footer-left">
          <FaCopyright className="footer-left-icon"></FaCopyright>

          <span>2019</span>
        </div>
        <div className="footer-middle">
          <Link to="/">
            <img className="footer-logo" src="../assets/smallLogo.svg" />
          </Link>
        </div>
        <div className="footer-right">
          <Link>
            <FaTwitter className="footer-right-icon-twiiter"></FaTwitter>
          </Link>
          <Link>
            {" "}
            <FaInstagram className="footer-right-icon-instagram"></FaInstagram>
          </Link>
          <Link>
            <FaFacebook className="footer-right-icon-facebook"></FaFacebook>
          </Link>
        </div>
      </div>
    );
  }
}
