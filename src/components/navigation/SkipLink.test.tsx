import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import en from "../../../messages/en.json";
import { renderWithIntl } from "@/test-utils/renderWithIntl";
import { SkipLink } from "./SkipLink";

describe("SkipLink", () => {
  it("renders a translated link", () => {
    renderWithIntl(<SkipLink />);
    expect(screen.getByRole("link", { name: en.common.skipToContent })).toBeInTheDocument();
  });

  it("targets the main content by default", () => {
    renderWithIntl(<SkipLink />);
    expect(screen.getByRole("link")).toHaveAttribute("href", "#main-content");
  });

  it("accepts a custom target", () => {
    renderWithIntl(<SkipLink targetId="projects" />);
    expect(screen.getByRole("link")).toHaveAttribute("href", "#projects");
  });
});
