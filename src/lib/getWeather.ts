import { GeoCoordinates } from "./checkIsMuddy";
import { OpenWeatherMapApi } from "ts-open-weather-map";

export interface WeatherData {
  averageTemperature: number;
  precipitation: number;
}

const weatherApiKey = import.meta.env.VITE_OPENWEATHER_API_KEY as string;

export const getWeather = async (
  coords: GeoCoordinates
): Promise<WeatherData> => {
  const api = new OpenWeatherMapApi(weatherApiKey);
  const weather = await api.oneCall(
    coords.latitude,
    coords.longitude,
    ["alerts", "current", "minutely", "hourly"],
    "imperial"
  );

  if (!weather.daily) {
    throw new Error("No daily weather data loaded");
  }

  // Average out the temperatures of the last 3 days
  // Add up the precipitation of the last 3 days
  let avgTemp = 0;
  let precip = 0;
  const last3Days = weather.daily.slice(0, 3);
  last3Days.forEach((day) => {
    // What's the hottest temp on each day?
    avgTemp += day.temp.max ?? 0;

    // Rain and snow are the same thing if it's hot enough
    precip += day.rain ?? 0;
    precip += day.snow ?? 0;
  });
  avgTemp = avgTemp / last3Days.length;

  return { averageTemperature: avgTemp, precipitation: precip };
};
