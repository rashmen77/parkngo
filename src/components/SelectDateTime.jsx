import React, { Component } from "react";
import { connect } from "react-redux";
import { FaAngleDown } from "react-icons/fa";
import DatePicker from "react-datepicker";

class UnconnectedSelectDateTime extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  setStartDateTime = date => {
    this.props.dispatch({
      type: "start-dateTime",
      value: date
    });
  };

  setEndDateTime = date => {
    this.props.dispatch({
      type: "end-dateTime",
      value: date
    });
  };

  render() {
    return (
      <>
        <div className="arriving">
          <DatePicker
            className="startDateTime"
            selected={this.props.startDateTime}
            onChange={date => this.setStartDateTime(date)}
            showTimeSelect
            timeFormat="HH:mm"
            timeIntervals={15}
            timeCaption="time"
            dateFormat="MMMM d, yyyy h:mm aa"
          />
          <FaAngleDown className="downIcon"></FaAngleDown>
        </div>
        <div className="leaving">
          <DatePicker
            className="endDateTime"
            selected={this.props.endDateTime}
            onChange={date => this.setEndDateTime(date)}
            showTimeSelect
            timeFormat="HH:mm"
            timeIntervals={15}
            timeCaption="time"
            dateFormat="MMMM d, yyyy h:mm aa"
          />
          <FaAngleDown className="downIcon"></FaAngleDown>
        </div>
      </>
    );
  }
}
let mapStateToProps = state => {
  return {
    startDateTime: state.startDateTime,
    endDateTime: state.endDateTime,
    targetAddress: state.searchAddData
  };
};
let SelectDateTime = connect(mapStateToProps)(UnconnectedSelectDateTime);

export default SelectDateTime;
