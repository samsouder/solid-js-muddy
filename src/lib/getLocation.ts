import { GeoCoordinates } from "./checkIsMuddy";

export const getLocation = async (): Promise<GeoCoordinates> => {
  return new Promise<GeolocationPosition>((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject);
  }).then((position) => {
    return {
      latitude: new Number(position.coords.latitude.toFixed(4)) as number,
      longitude: new Number(position.coords.longitude.toFixed(4)) as number,
    };
  });
};
