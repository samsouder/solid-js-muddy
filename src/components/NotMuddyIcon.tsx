import sunshine from "./sunshine.png";

const NotMuddyIcon = () => (
  <div class="grid justify-items-center">
    <img
      class="w-3/4"
      src={sunshine}
      title="It's not muddy today"
      aria-description="It's not muddy today"
      alt="Not Muddy Weather Icon"
    />
  </div>
);

export default NotMuddyIcon;
