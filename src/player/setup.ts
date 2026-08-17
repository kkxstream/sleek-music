import TrackPlayer, { Event, PlaybackState, PlayerCommand } from "@rntp/player";

import { handleAutoplayNext } from "./autoplay";

let isPlayerInitialized = false;

export function initPlayer() {
  if (isPlayerInitialized) {
    return;
  }

  isPlayerInitialized = true;

  try {
    TrackPlayer.setupPlayer({
      contentType: "music",
      handleAudioBecomingNoisy: true,
      cache: {
        maxSizeBytes: 100 * 1024 * 1024,
        preloading: { window: 1 },
      },
    });
  } catch {
    // Player already initialized across Fast Refresh reloads
  }

  TrackPlayer.setVolume(1.0);

  TrackPlayer.setCommands({
    capabilities: [
      PlayerCommand.PlayPause,
      PlayerCommand.Next,
      PlayerCommand.Previous,
      PlayerCommand.Seek,
    ],
    forwardInterval: 10,
    backwardInterval: 10,
  });

  TrackPlayer.addEventListener(Event.PlaybackStateChanged, ({ state }) => {
    if (state === PlaybackState.Ended) {
      handleAutoplayNext();
    }
  });
}
