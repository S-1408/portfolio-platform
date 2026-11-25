export function formatYearRange(startYear, endYear) {
  return endYear === undefined
    ? `${startYear}–Present`
    : `${startYear}–${endYear}`;
}
