import { IntlErrorCode, type IntlError } from "next-intl";

export function onIntlError(error: IntlError): void {
  if (error.code === IntlErrorCode.MISSING_MESSAGE) {
    console.error(`[i18n] ${error.message}`);
    return;
  }
  console.error(error);
}

export function getMessageFallback({
  namespace,
  key,
}: {
  namespace?: string;
  key: string;
}): string {
  return [namespace, key].filter(Boolean).join(".");
}
