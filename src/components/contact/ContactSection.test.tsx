import { screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import en from "../../../messages/en.json";
import pl from "../../../messages/pl.json";
import { siteConfig } from "@/content/site";
import { renderWithIntl } from "@/test-utils/renderWithIntl";
import { ContactSection } from "./ContactSection";

const action = async () => ({ status: "success" }) as const;

describe("ContactSection", () => {
  it.each([
    ["en", en],
    ["pl", pl],
  ] as const)("is the contact region, named by its whole heading (%s)", (locale, messages) => {
    renderWithIntl(<ContactSection action={action} />, { locale });
    const { titleOutline, titleSolid } = messages.contact;
    expect(screen.getByRole("region", { name: `${titleOutline} ${titleSolid}` })).toHaveAttribute(
      "id",
      "contact",
    );
  });

  it("offers the email as a mailto link", () => {
    renderWithIntl(<ContactSection action={action} />);
    expect(screen.getByRole("link", { name: siteConfig.links.email ?? "" })).toHaveAttribute(
      "href",
      `mailto:${siteConfig.links.email}`,
    );
  });

  it("lists profiles and the CV in a named list", () => {
    renderWithIntl(<ContactSection action={action} />);
    const list = screen.getByRole("list", { name: en.contact.linksLabel });
    expect(within(list).getByRole("link", { name: /LinkedIn/ })).toHaveAttribute(
      "href",
      siteConfig.links.linkedin ?? "",
    );
    expect(within(list).getByRole("link", { name: /GitHub/ })).toHaveAttribute(
      "href",
      siteConfig.links.github,
    );
    expect(
      within(list).getByRole("link", { name: new RegExp(en.common.downloadCv) }),
    ).toHaveAttribute("download");
  });

  it("states availability and contains the form", () => {
    renderWithIntl(<ContactSection action={action} />);
    expect(screen.getByText(/Poznań/)).toBeInTheDocument();
    expect(screen.getByRole("form", { name: en.contact.form.title })).toBeInTheDocument();
  });
});
