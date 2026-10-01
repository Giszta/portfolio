export function formatGeo(latitude: number, longitude: number): string {
  const ns = latitude >= 0 ? "N" : "S";
  const ew = longitude >= 0 ? "E" : "W";
  return `${Math.abs(latitude)}°${ns} ${Math.abs(longitude)}°${ew}`;
}
