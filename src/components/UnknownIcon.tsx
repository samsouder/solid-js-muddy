import clue from "./clue.png";

const UnknownIcon = () => (
  <img
    class="AppUnknownIcon"
    src={clue}
    title="Not sure yet, find out."
    aria-description="Not sure yet, find out."
    alt="Unknown Weather Icon"
  />
);

export default UnknownIcon;
