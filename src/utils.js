export function getLocation() {
  return new Promise(function (resolve, reject) {
    try {
      navigator.geolocation.getCurrentPosition(function (position, error) {
        if (error) {
          reject(error);
        } else {
          resolve(position.coords);
        }
      });
    } catch (err) {
      console.error(err);
    }
  });
}