import "./App.css";
import pig from "./pig.png";
import sunshine from "./sunshine.png";

function App() {
  return (
    <div class="App">
      <header class="AppHeader">
        <h1>Muddy or Not?</h1>
      </header>
      <article class="AppBar">
        <form>
          <button type="button" name="lookup">
            Where Am I?
          </button>
          &nbsp;&nbsp;&nbsp;&nbsp;
          <input type="text" name="lat" placeholder="Latitude (decimal)" />
          <input type="text" name="lon" placeholder="Longitude (decimal)" />
          <button type="submit">Muddy?</button>
        </form>
      </article>
      <article class="AppAnswer">
        <img class="AppMuddyIcon" src={pig} title="Muddy" alt="Muddy" />
      </article>
      <footer class="AppFooter">
        <p>
          <a href="https://www.flaticon.com/free-icons/mud" title="mud icons">
            Mud icons created by Freepik - Flaticon
          </a>
          &nbsp;&nbsp;&nbsp;&nbsp;
          <a href="https://www.flaticon.com/free-icons/sun" title="sun icons">
            Sun icons created by Darius Dan - Flaticon
          </a>
        </p>
      </footer>
    </div>
  );
}

export default App;
