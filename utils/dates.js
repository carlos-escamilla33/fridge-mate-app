// "2026-11-29" -> "11/29/2026"
export function isoToDisplay(iso) {
  const [year, month, day] = (iso ?? "").split("-");
  return year && month && day ? `${month}/${day}/${year}` : "";
}

// "11/29/2026" -> "2026-11-29", or null if it isn't a real date
export function displayToIso(display) {
  const match = display.trim().match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (!match) return null;
  const [, month, day, year] = match;
  const iso = `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
  return isNaN(new Date(iso).getTime()) ? null : iso;
}
