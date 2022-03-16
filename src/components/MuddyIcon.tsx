import pig from "./pig.png";

const MuddyIcon = () => (
  <div class="grid justify-items-center">
    <img
      class="w-3/4"
      src={pig}
      title="It's muddy today"
      aria-description="It's muddy today"
      alt="Muddy Weather Icon"
    />
  </div>
);

export default MuddyIcon;
