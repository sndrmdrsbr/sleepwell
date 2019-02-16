import React, { Component } from "react";
import Card from "react-bootstrap/Card";
import ListGroup from "react-bootstrap/ListGroup";
import ListGroupItem from "react-bootstrap/ListGroupItem";
import Button from "react-bootstrap/Button";
import Badge from "react-bootstrap/Badge";
import Image from "react-bootstrap/Image";
import michelinLogo from "../logos/michelin.png";

class Restaurant extends Component {
  state = {
    restaurantName: this.props.restaurant.restaurantName,
    address: this.props.restaurant.address,
    chef: this.props.restaurant.chef,
    restaurantUrl: this.props.restaurant.restaurantUrl,
    imageUrl: this.props.restaurant.imageUrl,
    restaurantPriceRange: this.props.restaurant.restaurantPrices,
    nbStars: this.props.restaurant.nbStars
  };
  render() {
    return (
      <>
        <Card.Body>
          <Card.Img variant="top" src={this.state.imageUrl} />
          <Card.Title className="m-2">{this.state.restaurantName}</Card.Title>
        </Card.Body>
        <ListGroup className="list-group-flush">
          <ListGroupItem variant="info">
            Chef Name : {this.state.chef}
          </ListGroupItem>
          <ListGroupItem>
            Michelin Stars :{" "}
            {this.state.nbStars === "1" && (
              <Image src={michelinLogo} height="20px" />
            )}
            {this.state.nbStars === "2" && (
              <>
                <Image src={michelinLogo} height="20px" />{" "}
                <Image src={michelinLogo} height="20px" />
              </>
            )}
            {this.state.nbStars === "3" && (
              <>
                <Image src={michelinLogo} height="20px" />{" "}
                <Image src={michelinLogo} height="20px" />{" "}
                <Image src={michelinLogo} height="20px" />
              </>
            )}
          </ListGroupItem>
          <ListGroupItem variant="info">
            Prices :{" "}
            {this.state.restaurantPriceRange !== "undefined" &&
              this.state.restaurantPriceRange}
            {this.state.restaurantPriceRange === "undefined" && (
              <Badge variant="warning">Contact restaurant</Badge>
            )}
          </ListGroupItem>
          <ListGroupItem>Address : {this.state.address}</ListGroupItem>
        </ListGroup>
        <Card.Footer variant="info">
          <Button
            variant="info"
            href="#"
            onClick={() => window.open(this.state.restaurantUrl, "_blank")}
          >
            View
          </Button>
        </Card.Footer>
      </>
    );
  }
}

export default Restaurant;