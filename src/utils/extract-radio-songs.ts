import type { RadioSongsResponse, Song } from "src/models";

export function extractRadioSongs(response?: RadioSongsResponse | null): Song[] {
  if (!response) {
    return [];
  }
  const songs: Song[] = [];
  for (const [key, value] of Object.entries(response)) {
    if (
      key !== "stationid" &&
      key !== "error" &&
      value &&
      typeof value === "object" &&
      "song" in value
    ) {
      songs.push(value.song);
    }
  }
  return songs;
}
