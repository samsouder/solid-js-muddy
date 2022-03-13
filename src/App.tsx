import "./App.css";
import MuddyIcon from "./components/MuddyIcon";
import NotMuddyIcon from "./components/NotMuddyIcon";
import UnknownIcon from "./components/UnknownIcon";
import { createResource, createSignal, Show } from "solid-js";
import { checkIsMuddy, GeoCoordinates, Weather } from "./lib/checkIsMuddy";
import { getLocation } from "./lib/getLocation";
import { getFromLocalStorage, setToLocalStorage } from "./lib/cache";

// Cache location and weather for 1 day
const locationCacheLength = 1 * 24 * 60 * 60 * 1000;
const weatherCacheLength = 1 * 24 * 60 * 60 * 1000;

// TODO: Add ErrorBoundary around components
// TODO: Investigate server-side rendering
const App = () => {
  const [coords, setCoords] = createSignal<GeoCoordinates | undefined>(
    getFromLocalStorage<GeoCoordinates>("location")
  );
  const setLocationFromCoords = (newCoords: GeoCoordinates) => {
    console.log("Setting location from coords", newCoords);
    setToLocalStorage("location", newCoords, locationCacheLength);
    setCoords(newCoords);
  };
  const setLocationFromBrowser = async () => {
    const newCoords = await getLocation();
    setLocationFromCoords(newCoords);
  };
  const muddyCheck = async () => {
    const key = `weather-${coords()?.latitude}-${coords()?.longitude}`;
    const cachedWeather = getFromLocalStorage<Weather>(key);
    if (cachedWeather) {
      return cachedWeather;
    }

    const weather = await checkIsMuddy(coords());
    setToLocalStorage(key, weather, weatherCacheLength);

    return weather;
  };
  const [isMuddy] = createResource(coords, muddyCheck);

  return (
    <div class="App">
      <header class="AppHeader">
        <h1>Muddy or Not?</h1>
        <h2>Will it be muddy in the next 3 days?</h2>
      </header>
      <article class="AppBar" role="menubar">
        <form
          onSubmit={(event) => {
            const newCoords = {
              // @ts-ignore
              latitude: parseFloat(event.currentTarget.elements["lat"].value),
              // @ts-ignore
              longitude: parseFloat(event.currentTarget.elements["lon"].value),
            };
            if (newCoords.latitude && newCoords.longitude) {
              setLocationFromCoords(newCoords);
            }

            event.preventDefault();
          }}
        >
          <button
            type="button"
            name="lookup"
            onClick={() => setLocationFromBrowser()}
          >
            Where Am I?
          </button>
          &nbsp;&nbsp;&nbsp;&nbsp;
          <input
            type="text"
            name="lat"
            placeholder="Latitude (decimal)"
            value={coords()?.latitude}
          />
          <input
            type="text"
            name="lon"
            placeholder="Longitude (decimal)"
            value={coords()?.longitude}
          />
          <button type="submit">Muddy?</button>
        </form>
      </article>
      <Show
        when={coords()?.latitude && coords()?.longitude}
        fallback={
          <article class="AppAnswer">
            <UnknownIcon />
          </article>
        }
      >
        <Show
          when={!isMuddy.loading}
          fallback={
            <article class="AppAnswer">
              <p>Loading...</p>
            </article>
          }
        >
          <aside class="AppSideBar">
            <dl>
              <dt>Average Temperature:</dt>
              <dd>{isMuddy()?.averageTemperature.toFixed()} &deg;</dd>
              <dt>Precipitation Total:</dt>
              <dd>{isMuddy()?.precipitation.toPrecision(2)} &Prime;</dd>
            </dl>
          </aside>
          <article class="AppAnswer">
            <Show when={isMuddy()?.isMuddy} fallback={<NotMuddyIcon />}>
              <MuddyIcon />
            </Show>
          </article>
        </Show>
      </Show>
      <footer class="AppFooter">
        <p>
          <a href="https://www.flaticon.com/free-icons/mud">
            Mud icons created by Freepik - Flaticon
          </a>
        </p>
        <p>
          <a href="https://www.flaticon.com/free-icons/sun">
            Sun icons created by Darius Dan - Flaticon
          </a>
        </p>
        <p>
          <a href="https://www.flaticon.com/free-icons/unknown">
            Unknown icons created by Freepik - Flaticon
          </a>
        </p>
      </footer>
    </div>
  );
};

export default App;
