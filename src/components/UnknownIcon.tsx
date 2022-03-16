import clue from "./clue.png";

const UnknownIcon = () => (
  <div class="grid justify-items-center">
    <img
      class="w-3/4"
      src={clue}
      title="Not sure yet, find out."
      aria-description="Not sure yet, find out."
      alt="Unknown Weather Icon"
    />
  </div>
);

export default UnknownIcon;
