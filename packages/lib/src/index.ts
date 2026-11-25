export function formatYearRange(startYear: number, endYear?: number): string {
  return endYear === undefined
    ? `${startYear}–Present`
    : `${startYear}–${endYear}`;
}
