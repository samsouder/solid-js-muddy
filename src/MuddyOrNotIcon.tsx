import pig from "./pig.png";
import sunshine from "./sunshine.png";

const MuddyOrNotIcon = (props: { muddy: boolean | undefined }) => (
  <>
    <img
      class="AppMuddyIcon"
      src={props.muddy ? pig : sunshine}
      title={props.muddy ? "Muddy" : "Not Muddy"}
      alt={props.muddy ? "Muddy Icon" : "Not Muddy Icon"}
    />
  </>
);

export default MuddyOrNotIcon;
