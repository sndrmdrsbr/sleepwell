import React, { Component } from "react";
import Card from "react-bootstrap/Card";
import ListGroup from "react-bootstrap/ListGroup";
import ListGroupItem from "react-bootstrap/ListGroupItem";
import Collapse from "react-bootstrap/Collapse";
import Button from "react-bootstrap/Button";
import Badge from "react-bootstrap/Badge";

class Hotel extends Component {
  state = {
    hotelName: this.props.hotel.hotelName,
    postalCode: this.props.hotel.postalCode,
    hotelUrl: this.props.hotel.hotelUrl,
    imageUrl: this.props.hotel.imageUrl,
    description: this.props.hotel.description,
    priceRange: this.props.hotel.priceRange,
    address: this.props.hotel.address,
    openDesc: false
  };

  render() {
    const { openDesc } = this.state;
    return (
      <>
        <Card.Body>
          <Card.Img variant="top" src={this.state.imageUrl} />
          <Card.Title className="m-2">{this.state.hotelName}</Card.Title>
          <Card.Text>
            {this.state.description.substring(
              0,
              this.state.description.indexOf(".") + 1
            )}
            <Collapse in={!this.state.openDesc}>
              <Badge
                pill
                className="m-2"
                size="sm"
                variant="secondary"
                onClick={() => this.setState({ openDesc: !openDesc })}
                aria-controls="restOfDesc"
                aria-expanded={openDesc}
              >
                . . .
              </Badge>
            </Collapse>
            <Collapse in={this.state.openDesc}>
              <span id="restOfDesc">
                {this.state.description.substring(
                  this.state.description.indexOf(".") + 1,
                  100000
                )}
              </span>
            </Collapse>
          </Card.Text>
        </Card.Body>
        <ListGroup className="list-group-flush">
          <ListGroupItem variant="info">
            Price Range per Night :{" "}
            {this.state.priceRange !== "undefined" && this.state.priceRange}
            {this.state.priceRange === "undefined" && (
              <Badge variant="warning">Not a hotel, restaurant only</Badge>
            )}
          </ListGroupItem>
          <ListGroupItem>Address : {this.state.address}</ListGroupItem>
        </ListGroup>
        <Card.Footer>
          <Button
            variant="info"
            href="#"
            onClick={() => window.open(this.state.hotelUrl, "_blank")}
          >
            View
          </Button>
        </Card.Footer>
      </>
    );
  }
}
export default Hotel;