var Promise = require("promise");
var request = require("request");
var cheerio = require("cheerio");
var fs = require("fs");

var promises = [];
var indivPromises = [];
var restaurants = [];

function createPromises() {
    for (var i = 1; i <= 35; i++) {
      let url = "https://restaurant.michelin.fr/restaurants/france/restaurants-1-etoile-michelin/restaurants-2-etoiles-michelin/restaurants-3-etoiles-michelin/page-" + i.toString();
      promises.push(fillRestaurantsList(url));
    }
  }
  
  function createIndividualPromises() {
    return new Promise(function(resolve, reject) {
      for (var i = 0; i < restaurantsList.length; i++) {
        let restaurantURL = restaurantsList[i].url;
        indivPromisesList.push(
          fillRestaurantInfo(/*proxyUrl + */ restaurantURL, i)
        );
        console.log("Added url of " + i + "th restaurant to the promises list");
        resolve();
      }
    });
  }
  
  function fillRestaurantsList(url) {
    return new Promise(function(resolve, reject) {
      request(url, function(err, res, html) {
        if (err) {
          console.error(err.message);
          return reject(err);
        } else if (res.statusCode !== 200) {
          //200 means request succesfull
          err = new Error("Unexpected status code : " + res.statusCode);
          err.res = res;
          console.error(err.message);
          return reject(err);
        }
        var $ = cheerio.load(html);
        $(".poi-card-link").each(function() {
          let data = $(this);
          let link = data.attr("href");
          let url = "https://restaurant.michelin.fr/" + link;
          restaurantsList.push({
            name: "",
            postalCode: "",
            chef: "",
            url: url,
            nbStars: "",
            priceRange: "",
            lat: "",
            lng: "",
            address: ""
          });
        });
        resolve(restaurantsList);
      });
    });
  }
  
  function getRestaurantInfo(url, index) {
    return new Promise(function(resolve, reject) {
      request(url, function(err, res, html) {
        if (err) {
          console.error(err.message);
          return reject(err);
        } else if (res.statusCode !== 200) {
          err = new Error("Unexpected status code : " + res.statusCode);
          err.res = res;
          console.error(err.message);
          return reject(err);
        }
  
        const $ = cheerio.load(html);
        $(".poi_intro-display-title") 
          .first()
          .each(function() {
            let data = $(this);
            let name = data.text();
            name = name.replace(/\n/g, "");
            restaurantsList[index].name = name.trim();
          });
        $(".postal-code")
          .first()
          .each(function() {
            let data = $(this);
            let pc = data.text();
            restaurantsList[index].postalCode = pc;
          });
        $(
          "#node_poi-guide-wrapper > div.node_poi-distinction-section > ul > li:nth-child(1) > div.content-wrapper"
        )
          .first()
          .each(function() {
            let data = $(this);
            let nbStars = data.text().split(" ")[0];
            restaurantsList[index].nbStars = nbStars;
          });
        $('span[itemprop="priceRange"]')
          .first()
          .each(function() {
            let data = $(this);
            let price = data.text();
            restaurantsList[index].priceRange = String(price.split("-")[1]).trim();
          });
        $('meta[itemprop="latitude"]')
          .first()
          .each(function() {
            let data = $(this);
            let lat = data.attr("content");
            restaurantsList[index].lat = String(lat);
          });
        $('meta[itemprop="longitude"]')
          .first()
          .each(function() {
            let data = $(this);
            let lng = data.attr("content");
            restaurantsList[index].lng = String(lng);
          });
        $(
          "#node_poi-menu-wrapper > div.node_poi-chef > div.node_poi_description > div.field.field--name-field-chef.field--type-text.field--label-above > div.field__items > div"
        )
          .first()
          .each(function() {
            let data = $(this);
            let chefname = data.text();
            restaurantsList[index].chef = chefname;
          });
        resolve(restaurantsList);
      });
    });
  }
  
  function saveRestaurantsInJson() {
    return new Promise(function(resolve, reject) {
      try {
        console.log("Trying to write the restaurant's JSON file");
        var jsonRestaurants = JSON.stringify(restaurantsList);
        fs.writeFile(
          "../JSON/starredRestaurants.json",
          jsonRestaurants,
          function doneWriting(err) {
            if (err) {
              console.error(err.message);
            }
          }
        );
      } catch (error) {
        console.error(error);
      }
      resolve();
    });
  }
  
  createPromises();
  Promise.all(promisesList)
    .then(createIndividualPromises)
    .then(() => {
      return Promise.all(indivPromisesList);
    })
    .then(saveRestaurantsInJson)
    .then(() => {
      console.log("Successfuly saved restaurants JSON file");
    });
  
  module.exports.getRestaurantsJSON = function() {
    return JSON.parse(fs.readFileSync("../JSON/listRestaurants.json"));
  };