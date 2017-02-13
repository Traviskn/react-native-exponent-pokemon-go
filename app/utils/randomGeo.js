// https://gist.github.com/mkhatib/5641004

// Usage Example.
// Generates 100 points that is in a 1km radius from the given lat and lng point.
// var randomGeoPoints = generateRandomPoints({'latitude':24.23, 'longitude':23.12}, 1000, 100);

/**
* Generates number of random geolocation points given a center and a radius.
* @param  {Object} center A JS object with latitude and longitude attributes.
* @param  {number} radius Radius in meters.
* @param {number} count Number of points to generate.
* @return {array} Array of Objects with lat and lng attributes.
*/
export function generateRandomPoints(center, radius, count) {
  var points = [];
  for (var i=0; i<count; i++) {
    points.push(generateRandomPoint(center, radius));
  }
  return points;
}


/**
* Generates number of random geolocation points given a center and a radius.
* Reference URL: http://goo.gl/KWcPE.
* @param  {Object} center A JS object with latitude and longitude attributes.
* @param  {number} radius Radius in meters.
* @return {Object} The generated random points as JS object with latitude and longitude attributes.
*/
export function generateRandomPoint(center, radius) {
  var x0 = center.longitude;
  var y0 = center.latitude;
  // Convert Radius from meters to degrees.
  var rd = radius/111300;

  var u = Math.random();
  var v = Math.random();

  var w = rd * Math.sqrt(u);
  var t = 2 * Math.PI * v;
  var x = w * Math.cos(t);
  var y = w * Math.sin(t);

  var xp = x/Math.cos(y0);

  // Resulting point.
  return {'latitude': y+y0, 'longitude': xp+x0};
}
