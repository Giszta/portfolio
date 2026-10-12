export function displayHost(url: string): string {
  return new URL(url).host.replace(/^www\./, "");
}