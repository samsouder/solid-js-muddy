import "./App.css";
import MuddyOrNotIcon from "./MuddyOrNotIcon";
import { checkIsMuddy } from "./lib/checkIsMuddy";
import { createResource, createSignal } from "solid-js";

function App() {
  const [coords, setCoords] = createSignal<GeolocationCoordinates>();
  const [isMuddy] = createResource(coords, checkIsMuddy);

  return (
    <div class="App">
      <header class="AppHeader">
        <h1>Muddy or Not?</h1>
      </header>
      <article class="AppBar">
        <form>
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
        <MuddyOrNotIcon muddy={isMuddy()} />
      </article>
      <footer class="AppFooter">
        <p>
          <a href="https://www.flaticon.com/free-icons/mud">
            Mud icons created by Freepik - Flaticon
          </a>
          &nbsp;&nbsp;&nbsp;&nbsp;
          <a href="https://www.flaticon.com/free-icons/sun">
            Sun icons created by Darius Dan - Flaticon
          </a>
        </p>
      </footer>
    </div>
  );
}

export default App;
