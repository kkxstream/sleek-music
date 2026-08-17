import type { Song } from "src/models";

import { formatDuration } from "./format-duration";

export function durationOfList(list?: Song[]) {
  return formatDuration(
    list?.reduce((totalSeconds, song) => totalSeconds + Number(song.more_info?.duration || 0), 0) ||
      0,
    "pretty",
  );
}
