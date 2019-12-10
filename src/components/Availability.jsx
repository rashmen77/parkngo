import React, { Component } from "react";
import { connect } from "react-redux";

class UnconnectedAvailability extends Component {
  render() {
    return (
      <div className="availability-container">
        <div className="availability-day">
          <select
            onChange={this.onChangeDay}
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
            onChange={this.onChangetime}
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
    );
  }
}

let mapStateToProps = state => {
  return {
    date: state.arrivalDate
  };
};
let Availability = connect(mapStateToProps)(UnconnectedAvailability);

export default Availability;
