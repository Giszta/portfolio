export interface PersonJsonLd {
  "@context": "https://schema.org";
  "@type": "Person";
  name: string;
  url: string;
  jobTitle: string;
  description: string;
  sameAs: string[];
  knowsAbout: string[];
  address: { "@type": "PostalAddress"; addressCountry: string };
}

interface PersonInput {
  name: string;
  url: string;
  jobTitle: string;
  description: string;
  sameAs: readonly (string | null)[];
  knowsAbout: readonly string[];
  countryCode: string;
}

export function buildPersonJsonLd(input: PersonInput): PersonJsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: input.name,
    url: input.url,
    jobTitle: input.jobTitle,
    description: input.description,
    sameAs: input.sameAs.filter((link): link is string => link !== null),
    knowsAbout: [...input.knowsAbout],
    address: { "@type": "PostalAddress", addressCountry: input.countryCode },
  };
}

/** JSON for a <script type="application/ld+json"> tag. Escapes "<" so content can never close the tag. */
export function serializeJsonLd(data: object): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
