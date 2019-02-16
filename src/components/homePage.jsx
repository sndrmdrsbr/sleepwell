import React, { Component } from "react";
import InputGroup from "react-bootstrap/InputGroup";
import FormControl from "react-bootstrap/FormControl";
import PageProgress from "react-page-progress";
import Jumbotron from "react-bootstrap/Jumbotron";
import starredHotels from "../JSON/listChateaux.json";
import CardColumns from "react-bootstrap/CardColumns";
import HotelCard from "./hotelCard.jsx";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import GoogleMapReact from "google-maps-react";
import HotelMapItem from "./hotelMapItem.jsx";

export class HomePage extends Component {
  state = {
    starredHotels: starredHotels,
    searchedHotels: [],
    searchValue: "",
    sortValue: "",
    mapOn: false,
    sortingDesc: false,
    userLat: 0,
    userLng: 1
  };

  handleChange = event => {
    var searchedHotels = [];
    var searchValue = event.target.value;
    this.setState({ searchValue });
    this.state.starredHotels.forEach(hotel => {
      if (
        String(hotel.address)
          .toLowerCase()
          .includes(searchValue.toLowerCase())
      ) {
        searchedHotels.push(hotel);
      } else if (
        String(hotel.hotelName)
          .toLowerCase()
          .includes(searchValue.toLowerCase())
      ) {
        searchedHotels.push(hotel);
      } else if (
        String(hotel.restaurantName)
          .toLowerCase()
          .includes(searchValue.toLowerCase())
      ) {
        searchedHotels.push(hotel);
      } else if (
        String(hotel.chef)
          .toLowerCase()
          .includes(searchValue.toLowerCase())
      ) {
        searchedHotels.push(hotel);
      } else if (
        String(hotel.description)
          .toLowerCase()
          .includes(searchValue.toLowerCase())
      ) {
        searchedHotels.push(hotel);
      } else if (
        searchValue.toLowerCase().includes("one") &&
        hotel.nbStars === "1"
      ) {
        searchedHotels.push(hotel);
      } else if (
        searchValue.toLowerCase().includes("two") &&
        hotel.nbStars === "2"
      ) {
        searchedHotels.push(hotel);
      } else if (
        searchValue.toLowerCase().includes("three") &&
        hotel.nbStars === "3"
      ) {
        searchedHotels.push(hotel);
      } else if (searchValue.toLowerCase().includes("map")) {
        this.setState({ mapOn: true });
      }
    });
    this.setState({ searchedHotels });
  };

  handleSelect = event => {
    var sortedHotels = [];
    var sortValue = event;
    var userLat = 0;
    var userLng = 1;
    this.setState({ sortValue });
    if (sortValue === "#stars") {
      sortedHotels = this.state.searchedHotels.sort((a, b) =>
        a.nbStars > b.nbStars ? 1 : b.nbStars > a.nbStars ? -1 : 0
      );
    }

    if (sortValue === "#prices") {
      function compareByPrice(a, b) {
        if (a.priceRange === "undefined" || a.priceRange === "") return 1;
        if (b.priceRange === "undefined" || b.priceRange === "") return -1;
        if (
          a.priceRange !== "undefined" &&
          b.priceRange !== "undefined" &&
          a.priceRange !== "" &&
          b.priceRange !== ""
        ) {
          if (
            a.priceRange.match(/\d+/g).map(Number)[0] <
            b.priceRange.match(/\d+/g).map(Number)[0]
          )
            return -1;
          if (
            a.priceRange.match(/\d+/g).map(Number)[0] >
            b.priceRange.match(/\d+/g).map(Number)[0]
          )
            return 1;
        }
        return 0;
      }
      sortedHotels = this.state.searchedHotels.sort(compareByPrice);
    }

    if (sortValue === "#distance") {
      function compareByDistance(a, b) {
        var distanceA = distanceInKmBetweenEarthCoordinates(
          userLat,
          userLng,
          a.lat,
          a.lng
        );
        var distanceB = distanceInKmBetweenEarthCoordinates(
          userLat,
          userLng,
          b.lat,
          b.lng
        );
        if (distanceA < distanceB) {
          console.log("smal");
          return -1;
        }
        if (distanceA > distanceB) {
          console.log("big");
          return 1;
        }
        return 0;
      }

      function degreesToRadians(degrees) {
        return (degrees * Math.PI) / 180;
      }
      // taken from : https://stackoverflow.com/questions/365826/calculate-distance-between-2-gps-coordinates
      function distanceInKmBetweenEarthCoordinates(lat1, lon1, lat2, lon2) {
        var earthRadiusKm = 6371;

        var dLat = degreesToRadians(lat2 - lat1);
        var dLon = degreesToRadians(lon2 - lon1);

        lat1 = degreesToRadians(lat1);
        lat2 = degreesToRadians(lat2);

        var a =
          Math.sin(dLat / 2) * Math.sin(dLat / 2) +
          Math.sin(dLon / 2) *
            Math.sin(dLon / 2) *
            Math.cos(lat1) *
            Math.cos(lat2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return earthRadiusKm * c;
      }

      sortedHotels = this.state.searchedHotels;
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
          // var userPos = JSON.parse(this.state.userPos);
          userLat = position.coords.latitude;
          userLng = position.coords.longitude;
          sortedHotels.sort(compareByDistance);
          this.setState({ searchedHotels: sortedHotels });
        });
      }
    }

    if (sortValue === "#clearSort") {
      this.setState({ sortingDesc: false });
    } else this.setState({ sortingDesc: true });

    this.setState({ searchedHotels: sortedHotels });
  };

  render() {
    const { mapOn } = this.state;
    const { sortingDesc } = this.state;
    return (
      <>
        <PageProgress animated color={"#17a2b8"} height={4} />
        <Jumbotron className="m-3">
          <h2 className="text-center" style={{ color: "#6388d1" }}>
            Search for Michelin Starred Relais & Chateaux Hotels
          </h2>
          <InputGroup className="mb-3">
            <InputGroup.Prepend>
              <InputGroup.Text id="addon">Magic Search Bar</InputGroup.Text>
            </InputGroup.Prepend>
            <FormControl
              placeholder="Name, Location, Chef, Restaurant, Price, Description... (Map to show the map)"
              aria-label="Username"
              aria-describedby="addon"
              value={this.state.searchValue}
              onChange={this.handleChange}
            />
            <DropdownButton
              alignRight
              as={InputGroup.Append}
              variant="outline-info"
              title="Sort By"
              id="sort-addon"
              value={this.state.sortValue}
              onSelect={this.handleSelect}
            >
              <Dropdown.Item href="#stars">Sort by Stars</Dropdown.Item>
              <Dropdown.Item href="#prices">Sort by Hotel Price</Dropdown.Item>
              <Dropdown.Item href="#distance">
                Sort by Distance
              </Dropdown.Item>{" "}
              <Dropdown.Divider />
              <Dropdown.Item href="#clearSort">No Sort</Dropdown.Item>
            </DropdownButton>
          </InputGroup>
          {sortingDesc && (
            <ul
              className="text-center"
              style={{
                color: "#6388d1",
                listStylePosition: "inside"
              }}
            >
              Sorting By :
              <li style={{ fontSize: "95%" }}>
                {this.state.sortValue
                  .charAt(1)
                  .toUpperCase()
                  .concat(this.state.sortValue.substring(2))}
              </li>
            </ul>
          )}
          {this.state.searchValue.length === 0 && (
            <ul
              className="text-center"
              style={{
                color: "#6388d1",
                listStylePosition: "inside"
              }}
            >
              You can search with : <br />
              <li style={{ color: "#7b97ce", fontSize: "95%" }}>
                Hotel or Restaurant Name
              </li>
              <li style={{ color: "#7b97ce", fontSize: "95%" }}>Postal Code</li>
              <li style={{ color: "#7b97ce", fontSize: "95%" }}>
                Name of the Chef
              </li>
              <li style={{ color: "#7b97ce", fontSize: "95%" }}>
                One, Two or Three : for the number of stars
              </li>
              <li style={{ color: "#7b97ce", fontSize: "95%" }}>
                Map : to have a map appear with all the Hotels (or click{" "}
                <u>
                  <a
                    href="#mapOn"
                    style={{ color: "#6388d1" }}
                    onClick={() => this.setState({ mapOn: !mapOn })}
                  >
                    here
                  </a>
                </u>
                )
              </li>
            </ul>
          )}
          <CardColumns>
            {this.state.searchedHotels.map(hotelCard => (
              <HotelCard key={hotelCard.id} hotelCard={hotelCard} />
            ))}
          </CardColumns>
          {this.state.mapOn && (
            <div style={{ height: "100vh", width: "100%" }}>
              <GoogleMapReact
                bootstrapURLKeys={{
                  key: "AIzaSyB64tTyWGKR9k7E1kEIpuPwR4spXgyP7R8"
                }}
                defaultCenter={{ lat: 46.795688, lng: 2.229444 }}
                defaultZoom={6}
              >
                {this.state.starredHotels.map(hotel => (
                  <HotelMapItem
                    key={hotel.id}
                    lat={Number(hotel.lat)}
                    lng={Number(hotel.lng)}
                    hotel={hotel}
                  />
                ))}
              </GoogleMapReact>
            </div>
          )}
        </Jumbotron>
      </>
    );
  }
}
export default HomePage;