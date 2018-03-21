
function showMap () {
  let myMap = L.map('map').setView([51.505, -0.09], 13);

  L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{maxZoom}/{x}/{y}.png?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
    maxZoom: 10,
    id: 'mapbox.streets',
    accessToken: 'pk.eyJ1IjoicGZhaWMiLCJhIjoiY2pmMTZwZTE1MDc5ZTMyb2t3amN4emx0aSJ9.eGIg8_Yx4S6dK8LmJ2817Q',
  }).addTo(myMap);
 }

module.exports = {showMap};
