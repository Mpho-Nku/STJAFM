export function gmapsDirectionsUrl(lat?: number, lng?: number) {
  if (!lat || !lng) return undefined;
  return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
}
export function fmtDate(d: string|Date) {
  const dt = typeof d === 'string' ? new Date(d) : d;
  return dt.toLocaleString();
}
