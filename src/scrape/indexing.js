const castle = require("./castle.js");
const michelin = require("./michelin.js");
var fs = require("fs");


const hotelsJSON = castle.getHotelsJSON();
const michelinJSON = michelin.getRestaurantsJSON();
const starredHotels = findMutualChefsAndPCs(hotelsJSON, michelinJSON);
fs.writeFileSync( "../JSON/listChateaux.json", JSON.stringify(starredHotels));
function findMutualChefsAndPCs(hotelsList, michelinsList) {
  var starredHotels = [];
  for (var i = 0; i < hotelsList.length; i++) {
    for (var j = 0; j < michelinsList.length; j++) {
      if (
        hotelsList[i].chef === michelinsList[j].chef &&
        hotelsList[i].postalCode === michelinsList[j].postalCode
      ) {
        starredHotels.push({
          id: i,
          hotelName: hotelsList[i].name,
          restaurantName: michelinsList[j].name,
          postalCode: hotelsList[i].postalCode,
          chef: hotelsList[i].chef,
          url: hotelsList[i].url,
          priceRange: hotelsList[i].priceRange,
          imageUrl: hotelsList[i].imageUrl,
          description: hotelsList[i].description,
          restaurantUrl: michelinsList[j].url,
          restaurantPrices: michelinsList[j].priceRange,
          nbStars: michelinsList[j].nbStars,
          lat: michelinsList[j].lat,
          lng: michelinsList[j].lng,
          address: hotelsList[i].address
        });
      }
    }
  }

  return starredHotels;
}

module.exports.starredHotels = starredHotels;
