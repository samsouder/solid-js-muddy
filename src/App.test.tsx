import { cleanup, render, screen } from "solid-testing-library";
import App from "./App";

describe("App", () => {
  afterEach(cleanup);

  it("renders with unknown location by default", () => {
    render(App);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      "Muddy or Not?"
    );
    expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent(
      "Will it be muddy in the next 3 days?"
    );
    expect(
      screen.getByRole("button", { name: "Where Am I?" })
    ).toBeInTheDocument();
    expect(screen.getByAltText("Unknown Weather Icon")).toBeInTheDocument();
  });
});
