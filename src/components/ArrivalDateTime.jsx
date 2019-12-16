import React, { Component } from "react";
import DatePicker from "react-datepicker";
import { connect } from "react-redux";
import moment from "moment";
import "rc-time-picker/assets/index.css";
import TimePicker from "rc-time-picker";

import "../css/arrivalDataTime.css";

class UnconnectedArrivalDateTime extends Component {
  constructor(props) {
    super(props);
    this.state = {
      date: new Date()
    };
  }

  onChangeDate = date => {
    this.props.dispatch({
      type: "arrivalDate-change",
      value: date
    });
  };

  setStartDate = evt => {
    this.props.dispatch({
      type: "arrivalTime-change",
      value: evt.target.value
    });
  };

  render() {
    return (
      <div className="arrivalContainer">
        <div className="arrival-calendar">
          <div className="dateSelect">
            {/* <Calendar
              className="calendar"
              onChange={this.onChangeDate}
              value={this.props.date}
            /> */}
            <DatePicker
              className="arrival"
              selected={this.state.date}
              onChange={date => setStartDate(date)}
              showTimeSelect
              timeFormat="HH:mm"
              timeIntervals={30}
              timeCaption="time"
              dateFormat="MMMM d, yyyy h:mm aa"
            />
          </div>
        </div>
        <div className="arrival-time">
          <select
            onChange={this.onChangetime}
            className="arrival-time-select"
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
    date: state.arrivalDate
  };
};
let ArrivalDateTime = connect(mapStateToProps)(UnconnectedArrivalDateTime);

export default ArrivalDateTime;
