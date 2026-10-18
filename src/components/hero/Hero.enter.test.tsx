import { describe, expect, it } from "vitest";
import { siteConfig } from "@/content/site";
import { renderWithIntl } from "@/test-utils/renderWithIntl";
import { Hero } from "./Hero";

describe("Hero entrance", () => {
  it("enters five groups in page order", () => {
    const { container } = renderWithIntl(<Hero />);
    const orders = Array.from(container.querySelectorAll<HTMLElement>("[data-hero-enter]")).map(
      (element) => element.style.getPropertyValue("--i"),
    );
    expect(orders).toEqual(["0", "1", "2", "3", "4"]);
  });

  it("never fades the lead in: it is the LCP element, so it only moves", () => {
    const { container } = renderWithIntl(<Hero />);
    const rising = container.querySelectorAll("[data-hero-enter='rise']");
    expect(rising).toHaveLength(1);
    expect(rising[0]?.tagName).toBe("P");
    expect(rising[0]?.textContent).toContain(siteConfig.name);
  });
});
