import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
  waitForElementToBeRemoved,
} from "solid-testing-library";
import { vi } from "vitest";
import { mswServer } from "./mocks/server";
import { rest } from "msw";
import App from "./App";
import { getGeolocation } from "./lib/getGeolocation";

vi.mock("./lib/getGeolocation");

describe("App", () => {
  beforeEach(() => {
    // Mock out localStorage so nothing gets cached between tests
    vi.spyOn(Storage.prototype, "getItem").mockReturnValue(null);
    vi.spyOn(Storage.prototype, "setItem");
  });

  afterEach(() => {
    vi.resetAllMocks();
    cleanup();
  });

  it("shows unknown by default", () => {
    render(App);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      "Muddy or Not?"
    );
    expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent(
      "Will it be muddy in the next 3 days?"
    );
    expect(
      screen.getByRole("button", { name: "Lookup location" })
    ).toBeInTheDocument();
    expect(screen.getByLabelText("Unknown Weather Icon")).toBeInTheDocument();
  });

  it("shows error if API request fails", async () => {
    mswServer.use(
      rest.get("*/onecall", (_req, res, ctx) =>
        res(ctx.status(400), ctx.json({ error: "Get out Anna!" }))
      )
    );

    render(App);

    // Enter location manually
    fireEvent.change(screen.getByPlaceholderText("Latitude"), {
      target: { value: "42.3601" },
    });
    fireEvent.change(screen.getByPlaceholderText("Longitude"), {
      target: { value: "-71.0589" },
    });

    const submit = screen.getByRole("button", { name: "Muddy?" });
    fireEvent.click(submit);

    await waitForElementToBeRemoved(() =>
      screen.getByLabelText("Unknown Weather Icon")
    );

    expect(
      screen.getByText("Error loading weather data, please try again")
    ).toBeInTheDocument();
  });

  it("shows error if no daily weather data returns from weather API", async () => {
    // Mock bad data from API
    mswServer.use(
      rest.get("*/onecall", (_req, res, ctx) =>
        res(ctx.status(200), ctx.json({}))
      )
    );

    render(App);

    // Enter location manually
    fireEvent.change(screen.getByPlaceholderText("Latitude"), {
      target: { value: "42.3601" },
    });
    fireEvent.change(screen.getByPlaceholderText("Longitude"), {
      target: { value: "-71.0589" },
    });

    const submit = screen.getByRole("button", { name: "Muddy?" });
    fireEvent.click(submit);

    await waitForElementToBeRemoved(() =>
      screen.getByLabelText("Unknown Weather Icon")
    );

    expect(
      screen.getByText("Error loading weather data, please try again")
    ).toBeInTheDocument();
  });

  it("does not break with odd weather data from weather API", async () => {
    // Mock bad data from API
    mswServer.use(
      rest.get("*/onecall", (_req, res, ctx) =>
        res(
          ctx.status(200),
          ctx.json({
            daily: [{ temp: {} }, { temp: {} }, { temp: {} }],
          })
        )
      )
    );

    render(App);

    // Enter location manually
    fireEvent.change(screen.getByPlaceholderText("Latitude"), {
      target: { value: "42.3601" },
    });
    fireEvent.change(screen.getByPlaceholderText("Longitude"), {
      target: { value: "-71.0589" },
    });

    const submit = screen.getByRole("button", { name: "Muddy?" });
    fireEvent.click(submit);

    await waitForElementToBeRemoved(() =>
      screen.getByLabelText("Unknown Weather Icon")
    );

    expect(screen.getByLabelText("Not Muddy Weather Icon")).toBeInTheDocument();
  });

  it.each([
    [
      "muddy",
      "warm + precip",
      [
        { temp: { max: 99 }, rain: 2, snow: 0 },
        { temp: { max: 99 }, rain: 0, snow: 0 },
        { temp: { max: 99 }, rain: 0, snow: 0 },
      ],
    ],
    [
      "not muddy",
      "warm but no precip",
      [
        { temp: { max: 99 }, rain: 0, snow: 0 },
        { temp: { max: 99 }, rain: 0, snow: 0 },
        { temp: { max: 99 }, rain: 0, snow: 0 },
      ],
    ],
    [
      "not muddy",
      "freezing",
      [
        { temp: { max: 15 }, rain: 0, snow: 2 },
        { temp: { max: 30 }, rain: 1, snow: 0 },
        { temp: { max: 22 }, rain: 0, snow: 2 },
      ],
    ],
  ])("shows %s when %s", async (muddyOrNot, _b, weatherData) => {
    mswServer.use(
      rest.get("*/onecall", (_req, res, ctx) =>
        res(ctx.status(200), ctx.json({ daily: weatherData }))
      )
    );

    render(App);

    // Enter location manually
    fireEvent.change(screen.getByPlaceholderText("Latitude"), {
      target: { value: "42.3601" },
    });
    fireEvent.change(screen.getByPlaceholderText("Longitude"), {
      target: { value: "-71.0589" },
    });

    const submit = screen.getByRole("button", { name: "Muddy?" });
    fireEvent.click(submit);

    await waitForElementToBeRemoved(() =>
      screen.getByLabelText("Unknown Weather Icon")
    );

    const iconAlt =
      muddyOrNot === "muddy" ? "Muddy Weather Icon" : "Not Muddy Weather Icon";
    expect(screen.getByLabelText(iconAlt)).toBeInTheDocument();
  });

  it("shows cached weather data after first API hit", async () => {
    // Remove all localStorage mocking
    vi.restoreAllMocks();

    mswServer.use(
      rest.get("*/onecall", (_req, res, ctx) =>
        res(
          ctx.status(200),
          ctx.json({
            daily: [
              { temp: { max: 99 }, rain: 2, snow: 0 },
              { temp: { max: 99 }, rain: 0, snow: 0 },
              { temp: { max: 99 }, rain: 0, snow: 0 },
            ],
          })
        )
      )
    );

    render(App);

    // Enter location manually
    fireEvent.change(screen.getByPlaceholderText("Latitude"), {
      target: { value: "42.3601" },
    });
    fireEvent.change(screen.getByPlaceholderText("Longitude"), {
      target: { value: "-71.0589" },
    });

    const submit = screen.getByRole("button", { name: "Muddy?" });
    fireEvent.click(submit);

    await waitForElementToBeRemoved(() =>
      screen.getByLabelText("Unknown Weather Icon")
    );

    expect(screen.getByLabelText("Muddy Weather Icon")).toBeInTheDocument();

    // Mock an API failure (which shouldn't hit)
    mswServer.use(
      rest.get("*/onecall", (_req, res, ctx) =>
        res(ctx.status(400), ctx.json({ error: "Get out Anna!" }))
      )
    );

    // Click submit again
    fireEvent.click(submit);

    await waitForElementToBeRemoved(() =>
      screen.getByLabelText("Unknown Weather Icon")
    );

    expect(screen.getByLabelText("Muddy Weather Icon")).toBeInTheDocument();
  });

  it("does nothing if checking muddy with no location", async () => {
    // Mock an API failure (which shouldn't hit)
    mswServer.use(
      rest.get("*/onecall", (_req, res, ctx) =>
        res(ctx.status(400), ctx.json({ error: "Get out Anna!" }))
      )
    );

    render(App);

    const submit = screen.getByRole("button", { name: "Muddy?" });
    fireEvent.click(submit);

    expect(screen.getByLabelText("Unknown Weather Icon")).toBeInTheDocument();
  });

  it("fetches geolocation, fill in lat + long, and run weather API", async () => {
    // Mock location API
    vi.mocked(getGeolocation).mockResolvedValue({
      timestamp: Date.now(),
      coords: {
        latitude: 123.45678901234,
        longitude: -12.345678901234,
        accuracy: 10,
        altitude: null,
        altitudeAccuracy: null,
        heading: null,
        speed: null,
      },
    });

    // Mock weather API
    mswServer.use(
      rest.get("*/onecall", (_req, res, ctx) =>
        res(
          ctx.status(200),
          ctx.json({
            daily: [
              { temp: { max: 32 }, rain: 2, snow: 0 },
              { temp: { max: 32 }, rain: 2, snow: 0 },
              { temp: { max: 32 }, rain: 2, snow: 0 },
            ],
          })
        )
      )
    );

    render(App);

    // Pick location automatically
    fireEvent.click(screen.getByRole("button", { name: "Lookup location" }));

    await waitFor(() => screen.getByLabelText("Muddy Weather Icon"));

    // Location is filled in?
    expect(screen.getByTestId("location-form")).toHaveFormValues({
      lat: "123.4568",
      lon: "-12.3457",
    });
  });
});
