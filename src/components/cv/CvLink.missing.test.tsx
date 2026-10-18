import { screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { renderWithIntl } from "@/test-utils/renderWithIntl";
import { CvLink } from "./CvLink";

vi.mock("@/content/site", () => ({
  siteConfig: { name: "Adam Giszter", cv: null },
}));

describe("CvLink without a CV", () => {
  it("renders nothing", () => {
    renderWithIntl(<CvLink>CV</CvLink>);
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
  });
});
