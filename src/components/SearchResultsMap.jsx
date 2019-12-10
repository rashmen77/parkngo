import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import ReactMapGL from "react-map-gl";
import DeckGL, { GeoJsonLayer } from "deck.gl";

class UnconnectedSearchResultsMap extends Component {
  state = {
    viewport: {
      width: 800,
      height: 800,
      latitude: this.props._lat,
      longitude: this.props._lng,
      zoom: 15
    }
  };
  MAPBOX_TOKEN =
    "pk.eyJ1IjoicmFzaHNpdmE3NyIsImEiOiJjazN0MjR3MzcwZGUxM211aTBjanFiM3Q0In0.WnNe0New65UY1pzvaC-Njg";

  render() {
    return (
      <div className="Map_box">
        <ReactMapGL
          mapboxApiAccessToken={
            "pk.eyJ1IjoicmFzaHNpdmE3NyIsImEiOiJjazN0MjR3MzcwZGUxM211aTBjanFiM3Q0In0.WnNe0New65UY1pzvaC-Njg"
          }
          mapStyle="mapbox://styles/rashsiva77/ck3tg4jtv12ss1cs4txn1vcpp"
          {...this.state.viewport}
          onViewportChange={viewport => this.setState({ viewport })}
        />
      </div>
    );
  }
}
let mapStateToProps = state => {
  return {
    _lat: state.searchLat,
    _lng: state.searchLng
  };
};
let SearchResultsMap = connect(mapStateToProps)(UnconnectedSearchResultsMap);

export default SearchResultsMap;
