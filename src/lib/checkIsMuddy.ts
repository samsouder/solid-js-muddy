import { getWeather, WeatherData } from "./getWeather";

export interface GeoCoordinates {
  latitude: number;
  longitude: number;
}

export interface Weather extends WeatherData {
  isMuddy: boolean;
}

export const checkIsMuddy = async (
  coords: GeoCoordinates | undefined
): Promise<Weather> => {
  if (!coords) {
    throw new Error("No coordinates");
  }

  // Get weather for last 3 days in the current location
  const weather = await getWeather(coords);

  // If temperature is less than 32, return false because it's freezing
  if (weather.averageTemperature < 32) return { ...weather, isMuddy: false };

  // If there is any precipitation today, return true
  if (weather.precipitation > 0) return { ...weather, isMuddy: true };

  return { ...weather, isMuddy: false };
};
