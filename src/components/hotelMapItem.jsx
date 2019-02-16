import React, { Component } from "react";
import Shapes from "react-shapes";
import Badge from "react-bootstrap/Badge";

class HotelMapItem extends Component {
  state = { hotelName: this.props.hotel.hotelName, openName: false };
  render() {
    return (
      <>
        <Badge size="sm" pill variant="info">
          {this.state.hotelName}
        </Badge>
        <Shapes.Triangle
          width="10"
          height="10"
          fill={{ color: "#6388d1" }}
          stroke={{ color: "black" }}
        />
      </>
    );
  }
}
export default HotelMapItem;