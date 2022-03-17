import MuddyIcon from "./components/MuddyIcon";
import NotMuddyIcon from "./components/NotMuddyIcon";
import UnknownIcon from "./components/UnknownIcon";
import { createResource, createSignal, ErrorBoundary, Show } from "solid-js";
import { checkIsMuddy, GeoCoordinates, Weather } from "./lib/checkIsMuddy";
import { getLocation } from "./lib/getLocation";
import { getFromLocalStorage, setToLocalStorage } from "./lib/cache";
import LoadingFailed from "./components/LoadingFailed";
import Forecast from "./components/Forecast";

// Cache location and weather for 1 day
const locationCacheLength = 1 * 24 * 60 * 60 * 1000;
const weatherCacheLength = 1 * 24 * 60 * 60 * 1000;

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
  const submitLocationForm = (e: Event) => {
    e.preventDefault();
    const newCoords = {
      // @ts-ignore
      latitude: parseFloat(e.currentTarget.elements["lat"].value),
      // @ts-ignore
      longitude: parseFloat(e.currentTarget.elements["lon"].value),
    };
    if (newCoords.latitude && newCoords.longitude) {
      setLocationFromCoords(newCoords);
    }
  };

  return (
    <div class="min-h-screen text-black dark:text-white bg-gray-50 dark:bg-gray-800 py-6 flex flex-col justify-center relative overflow-hidden sm:py-12">
      <div class="relative p-8 bg-white dark:bg-gray-600 shadow-xl ring-2 ring-gray-300 dark:ring-gray-500 sm:max-w-xl sm:mx-auto sm:rounded-lg sm:px-10">
        <div class="max-w-full mx-auto">
          <div class="divide-y-2 divide-gray-900/10 dark:divide-gray-500">
            <div>
              <header class="">
                <h1 class="text-6xl text-center font-bold my-6">
                  Muddy or Not?
                </h1>
                <h2 class="text-xl text-center font-light my-6">
                  Will it be muddy in the next 3 days?
                </h2>
              </header>
              <article class="my-6" role="menubar">
                <form
                  class="flex flex-nowrap items-center"
                  data-testid="location-form"
                  onSubmit={(e: Event) => submitLocationForm(e)}
                >
                  <button
                    class="flex-none"
                    type="button"
                    name="lookup"
                    aria-label="Lookup location"
                    title="Lookup location"
                    onClick={() => setLocationFromBrowser()}
                  >
                    <svg
                      class="flex-none w-6 h-6 fill-blue-500 mr-4"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M12 0c-4.198 0-8 3.403-8 7.602 0 4.198 3.469 9.21 8 16.398 4.531-7.188 8-12.2 8-16.398 0-4.199-3.801-7.602-8-7.602zm0 11c-1.657 0-3-1.343-3-3s1.343-3 3-3 3 1.343 3 3-1.343 3-3 3z" />
                      Where Am I?
                    </svg>
                  </button>
                  <input
                    class="flex-auto w-10 bg-white dark:bg-gray-800 ring-2 ring-gray-300 dark:ring-gray-500 rounded-lg p-2 mr-2 shadow-md"
                    type="text"
                    inputMode="decimal"
                    name="lat"
                    placeholder="Latitude"
                    value={coords()?.latitude}
                  />
                  <input
                    class="flex-auto w-10 bg-white dark:bg-gray-800 ring-2 ring-gray-300 dark:ring-gray-500 rounded-lg p-2 mr-2 shadow-md"
                    type="text"
                    inputMode="decimal"
                    name="lon"
                    placeholder="Longitude"
                    value={coords()?.longitude}
                  />
                  <button
                    class="flex-none rounded-lg p-2 ml-3 bg-blue-500 text-white font-bold shadow-md"
                    type="submit"
                  >
                    Muddy?
                  </button>
                </form>
              </article>
              <article class="text-center">
                <Show
                  when={coords()?.latitude && coords()?.longitude}
                  fallback={<UnknownIcon />}
                >
                  <ErrorBoundary fallback={<LoadingFailed />}>
                    <Show
                      when={!isMuddy.loading}
                      fallback={
                        <>
                          <Forecast loading={true} />
                          <UnknownIcon />
                        </>
                      }
                    >
                      <Forecast loading={false} forecast={isMuddy()} />
                      <Show
                        when={isMuddy()?.isMuddy}
                        fallback={<NotMuddyIcon />}
                      >
                        <MuddyIcon />
                      </Show>
                    </Show>
                  </ErrorBoundary>
                </Show>
              </article>
            </div>
            <footer class="pt-8 flex text-xs flex-col text-center">
              <a
                class="text-blue-400 hover:text-blue-500"
                href="https://erikflowers.github.io/weather-icons/"
              >
                Weather Icons by Erik Flowers
              </a>
            </footer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
