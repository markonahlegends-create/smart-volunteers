export function normalizeUnitName(name: string): string {
  return name
    .toLowerCase()
    .replace(/\bnegeri\b/gi, 'negeri')
    .replace(/\bnikh\b/gi, 'nikh')
    .replace(/\bma'arif\b/gi, "ma'arif")
    .replace(/[^a-z0-9\s'-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}
