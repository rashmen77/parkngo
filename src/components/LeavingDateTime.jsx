import React, { Component } from "react";
import Calendar from "react-calendar";
import { connect } from "react-redux";
import moment from "moment";
import "rc-time-picker/assets/index.css";
import TimePicker from "rc-time-picker";

import "../css/leavingDateTime.css";

class UnconnectedLeavingDateTime extends Component {
  constructor(props) {
    super(props);
    this.state = {
      date: new Date()
    };
  }

  onChangeDate = date => {
    this.props.dispatch({
      type: "leavingDate-change",
      value: date
    });
  };

  onChangetime = evt => {
    this.props.dispatch({
      type: "leavingTime-change",
      value: evt.target.value
    });
  };

  render() {
    return (
      <div className="leavingContainer">
        <div className="leaving-calendar">
          <div className="dateSelect">
            <Calendar
              className="calendar"
              onChange={this.onChangeDate}
              value={this.props.date}
            />
          </div>
        </div>
        <div className="leaving-time">
          <select
            onChange={this.onChangetime}
            className="leaving-time-select"
            size="15"
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
    );
  }
}

let mapStateToProps = state => {
  return {
    date: state.leavingDate
  };
};
let LeavingDateTime = connect(mapStateToProps)(UnconnectedLeavingDateTime);

export default LeavingDateTime;