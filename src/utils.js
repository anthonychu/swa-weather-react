export function getLocation() {
  return new Promise(function (resolve, reject) {
    if (window.location.hostname === 'localhost') {
      // return fixed location when running locally to hide location during debugging demos
      resolve({
        latitude: 49.2833329,
        longitude: -123.1200278,
      });
    } else {
      navigator.geolocation.getCurrentPosition(function (position, error) {
        if (error) {
          reject(error);
        } else {
          resolve(position.coords);
        }
      });
    }
  });
}