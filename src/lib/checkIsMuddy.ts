import { getWeather } from "./getWeather";

export interface GeoCoordinates {
  latitude: number;
  longitude: number;
}

export const checkIsMuddy = async (coords: GeoCoordinates | undefined) => {
  if (!coords) {
    console.log("No coordinates, skipping weather check");

    return false;
  }

  // Get weather for today in the current location
  const weather = await getWeather(coords);

  console.log("Weather", weather);

  // If temperature is less than 32, return false because it's freezing
  if (weather.temperature < 32) return false;

  // If there is any precipitation today, return true
  if (weather.precipitation > 0) return true;

  return false;
};
