import "./App.css";
import MuddyIcon from "./components/MuddyIcon";
import NotMuddyIcon from "./components/NotMuddyIcon";
import UnknownIcon from "./components/UnknownIcon";
import { checkIsMuddy, GeoCoordinates } from "./lib/checkIsMuddy";
import { createEffect, createResource, createSignal, Show } from "solid-js";

const App = () => {
  const [coords, setCoords] = createSignal<GeoCoordinates>();
  const [isMuddy] = createResource(coords, checkIsMuddy);

  createEffect(() => {
    console.log("isMuddy?", isMuddy());
  });

  return (
    <div class="App">
      <header class="AppHeader">
        <h1>Muddy or Not?</h1>
      </header>
      <article class="AppBar">
        <form
          onSubmit={(event) => {
            const newCoords = {
              latitude: parseFloat(event.currentTarget.elements["lat"].value),
              longitude: parseFloat(event.currentTarget.elements["lon"].value),
            };
            if (newCoords.latitude && newCoords.longitude) {
              setCoords(newCoords);
            }

            event.preventDefault();
          }}
        >
          <button
            type="button"
            name="lookup"
            onClick={() => {
              navigator.geolocation.getCurrentPosition((location) => {
                setCoords(location.coords);
              });
            }}
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
      <article class="AppAnswer">
        {/* <pre>isMuddy?: {JSON.stringify(isMuddy(), null, 2)}</pre> */}
        <Show
          when={coords()?.latitude && coords()?.longitude}
          fallback={<UnknownIcon />}
        >
          <Show when={!isMuddy.loading} fallback={<p>Loading...</p>}>
            <Show when={isMuddy()} fallback={<NotMuddyIcon />}>
              <MuddyIcon />
            </Show>
          </Show>
        </Show>
      </article>
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
