import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { DataPoint } from "./DataPoint";

describe("DataPoint", () => {
  it("renders a term/definition pair inside a description list", () => {
    render(
      <dl>
        <DataPoint value="7+" label="Years of engineering" />
      </dl>,
    );
    expect(screen.getByRole("term")).toHaveTextContent("Years of engineering");
    expect(screen.getByRole("definition")).toHaveTextContent("7+");
  });

  it("keeps the label before the value in DOM order", () => {
    const { container } = render(
      <dl>
        <DataPoint value="7+" label="Years" />
      </dl>,
    );
    const [first, second] = Array.from(container.querySelectorAll("dt, dd"));
    expect(first?.tagName).toBe("DT");
    expect(second?.tagName).toBe("DD");
  });
});
