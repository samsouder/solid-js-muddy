import { GeoCoordinates } from "./checkIsMuddy";
import { getGeolocation } from "./getGeolocation";

export const getLocation = async (): Promise<GeoCoordinates> => {
  return getGeolocation().then((position) => {
    return {
      latitude: new Number(position.coords.latitude.toFixed(4)) as number,
      longitude: new Number(position.coords.longitude.toFixed(4)) as number,
    };
  });
};
