import { getWeather } from "./getWeather";
import { checkIsMuddy } from "./checkIsMuddy";

vi.mock("./getWeather");

describe("checkIsMuddy", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("throws error if no coordinates are given", async () => {
    const coords = undefined;
    await expect(checkIsMuddy(coords)).rejects.toThrow("No coordinates");
  });

  it("returns not muddy if temperature less than 32", async () => {
    vi.mocked(getWeather).mockResolvedValueOnce({
      averageTemperature: 31,
      precipitation: 2,
    });

    const coords = { latitude: 0, longitude: 0 };
    const weather = await checkIsMuddy(coords);
    expect(weather.isMuddy).toBe(false);
  });

  it("returns muddy if temperature is 32 or over and precipitation is over 0", async () => {
    vi.mocked(getWeather).mockResolvedValueOnce({
      averageTemperature: 32,
      precipitation: 2,
    });

    const coords = { latitude: 0, longitude: 0 };
    const weather = await checkIsMuddy(coords);
    expect(weather.isMuddy).toBe(true);
  });

  it("returns not muddy if temperature is over 32 but precipitation is 0", async () => {
    vi.mocked(getWeather).mockResolvedValueOnce({
      averageTemperature: 32,
      precipitation: 0,
    });

    const coords = { latitude: 0, longitude: 0 };
    const weather = await checkIsMuddy(coords);
    expect(weather.isMuddy).toBe(false);
  });
});
