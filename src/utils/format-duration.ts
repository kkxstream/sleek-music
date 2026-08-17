export function formatDuration(seconds: number, format: "pretty" | "colon" = "colon") {
  if (Number.isNaN(seconds)) {
    return "--:--";
  }

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  const padTwoDigits = (value: number) => String(value).padStart(2, "0");

  if (format === "colon") {
    return [hours && padTwoDigits(hours), padTwoDigits(minutes), padTwoDigits(remainingSeconds)]
      .filter(Boolean)
      .join(":");
  }

  return [hours ? `${hours}h` : "", minutes ? `${minutes}m` : "", `${remainingSeconds}s`]
    .filter(Boolean)
    .join(" ");
}
