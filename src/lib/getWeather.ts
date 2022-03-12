import { GeoCoordinates } from "./checkIsMuddy";

export const getWeather = async (coords: GeoCoordinates) => {
  console.log("Coordinates", coords);

  await new Promise((resolve) => setTimeout(resolve, 2000));

  return { temperature: Math.floor(Math.random() * 70), precipitation: 1.1 };
};
