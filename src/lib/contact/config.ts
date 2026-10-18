import { siteConfig } from "@/content/site";

export interface MailConfig {
  apiKey: string;
  from: string;
  to: string;
}

const DEFAULT_FROM = "Portfolio <onboarding@resend.dev>";

function nonEmpty(value: string | undefined): string | undefined {
  const trimmed = value?.trim();
  return trimmed === "" ? undefined : trimmed;
}

/** null = poczta nie jest skonfigurowana; formularz odpowie wtedy „nie udało się wysłać". */
export function readMailConfig(
  env: Readonly<Record<string, string | undefined>>,
): MailConfig | null {
  const apiKey = nonEmpty(env.RESEND_API_KEY);
  const to = nonEmpty(env.CONTACT_TO_EMAIL) ?? siteConfig.links.email;
  if (apiKey === undefined || to === null) return null;
  return { apiKey, to, from: nonEmpty(env.CONTACT_FROM_EMAIL) ?? DEFAULT_FROM };
}
