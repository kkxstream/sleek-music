import TrackPlayer, { PlaybackState, RepeatMode, useProgress } from "@rntp/player";
import {
  Disc as DiscIcon,
  LetterText as LetterTextIcon,
  ListMusic as ListMusicIcon,
  PauseCircle as PauseCircleIcon,
  PlayCircle as PlayCircleIcon,
  Repeat1 as RepeatOneIcon,
  Repeat as RepeatIcon,
  Shuffle as ShuffleIcon,
  SkipBack as SkipBackIcon,
  SkipForward as SkipForwardIcon,
} from "@tamagui/lucide-icons-2";
import { memo, useState } from "react";
import { formatDuration } from "src/utils";
import { Button, SizableText, Slider, Spinner, View, XStack, YStack } from "tamagui";

export type ViewMode = "player" | "lyrics" | "queue";

export const NAV_CONFIG: Record<ViewMode, { label: string; icon: typeof DiscIcon }> = {
  player: { label: "Player", icon: DiscIcon },
  lyrics: { label: "Lyrics", icon: LetterTextIcon },
  queue: { label: "Queue", icon: ListMusicIcon },
};

export const NAV_TARGETS: Record<ViewMode, [ViewMode, ViewMode]> = {
  player: ["lyrics", "queue"],
  lyrics: ["player", "queue"],
  queue: ["lyrics", "player"],
};

export const PlayerScrubber = memo(function PlayerScrubber({
  trackDurationFallback,
}: {
  trackDurationFallback?: number;
}) {
  const { position, duration, buffered } = useProgress(0.25);
  const [isSliding, setIsSliding] = useState(false);
  const [slidingValue, setSlidingValue] = useState(0);

  const totalDuration = duration > 0 ? duration : trackDurationFallback || 0;
  const currentPosition = isSliding ? slidingValue : Math.floor(position);
  const remaining = Math.max(0, totalDuration - currentPosition);
  const bufferedWidth: `${number}%` =
    totalDuration > 0 ? `${Math.min(100, (buffered / totalDuration) * 100)}%` : "0%";

  return (
    <XStack items="center" gap="$2.5" width="100%">
      <SizableText
        size="$1"
        color="$color11"
        fontWeight="600"
        minW={38}
        style={{ textAlign: "right" }}
      >
        {formatDuration(currentPosition)}
      </SizableText>

      <Slider
        flex={1}
        orientation="horizontal"
        value={[currentPosition]}
        max={Math.max(1, Math.floor(totalDuration))}
        step={1}
        onSlideStart={() => {
          setIsSliding(true);
          setSlidingValue(Math.floor(position));
        }}
        onValueChange={(values) => {
          setIsSliding(true);
          setSlidingValue(values[0]);
        }}
        onSlideEnd={(_, endValue) => {
          const seekTarget = typeof endValue === "number" ? endValue : slidingValue;
          setIsSliding(false);
          TrackPlayer.seekTo(seekTarget);
        }}
      >
        <Slider.Track>
          <View bg="$color5" position="absolute" height="100%" width={bufferedWidth} />
          <Slider.TrackActive bg="$blue10" />
        </Slider.Track>
        <Slider.Thumb size="$1" index={0} circular />
      </Slider>

      <SizableText size="$1" color="$color11" fontWeight="600" minW={42}>
        -{formatDuration(Math.floor(remaining))}
      </SizableText>
    </XStack>
  );
});

export const PlayerTransport = memo(function PlayerTransport({
  playing,
  playbackState,
  shuffleMode,
  repeatMode,
  onToggleShuffle,
  onCycleRepeat,
}: {
  playing: boolean;
  playbackState: PlaybackState;
  shuffleMode: boolean;
  repeatMode: RepeatMode;
  onToggleShuffle: () => void;
  onCycleRepeat: () => void;
}) {
  const isRepeatActive = repeatMode !== RepeatMode.Off;
  const RepeatIconComponent = repeatMode === RepeatMode.One ? RepeatOneIcon : RepeatIcon;

  return (
    <XStack justify="space-around" items="center" width="100%" py="$1">
      <Button
        icon={ShuffleIcon}
        color={shuffleMode ? "$blue10" : "$color11"}
        chromeless
        circular
        size="$3"
        scaleIcon={1.3}
        pressStyle={{ scale: 0.9 }}
        onPress={onToggleShuffle}
      />
      <Button
        icon={SkipBackIcon}
        color="$color12"
        chromeless
        circular
        size="$4"
        scaleIcon={1.7}
        pressStyle={{ scale: 0.9 }}
        onPress={async () => TrackPlayer.skipToPrevious()}
      />
      <Button
        icon={
          playbackState === PlaybackState.Buffering ? (
            <Spinner size="small" color="white" />
          ) : playing ? (
            PauseCircleIcon
          ) : (
            PlayCircleIcon
          )
        }
        bg="$blue10"
        hoverStyle={{ bg: "$blue11" }}
        color="white"
        circular
        size="$6"
        scaleIcon={2.3}
        elevation="$3"
        pressStyle={{ scale: 0.93, opacity: 0.9 }}
        disabled={playbackState === PlaybackState.Buffering}
        onPress={() => (playing ? TrackPlayer.pause() : TrackPlayer.play())}
      />
      <Button
        icon={SkipForwardIcon}
        color="$color12"
        chromeless
        circular
        size="$4"
        scaleIcon={1.7}
        pressStyle={{ scale: 0.9 }}
        onPress={() => TrackPlayer.skipToNext()}
      />
      <Button
        icon={RepeatIconComponent}
        color={isRepeatActive ? "$blue10" : "$color11"}
        chromeless
        circular
        size="$3"
        scaleIcon={1.3}
        pressStyle={{ scale: 0.9 }}
        onPress={onCycleRepeat}
      />
    </XStack>
  );
});

export const PlayerBottomNav = memo(function PlayerBottomNav({
  viewMode,
  tracksCount,
  onSelectMode,
}: {
  viewMode: ViewMode;
  tracksCount: number;
  onSelectMode: (mode: ViewMode) => void;
}) {
  const targets = NAV_TARGETS[viewMode];

  return (
    <XStack justify="space-between" items="center" width="100%" gap="$2" pt="$0.5">
      {targets.map((mode) => {
        const { label, icon: Icon } = NAV_CONFIG[mode];
        return (
          <Button
            key={mode}
            flex={1}
            size="$3"
            rounded="$3"
            bg="$color3"
            chromeless
            pressStyle={{ scale: 0.97 }}
            icon=<Icon size={15} color="$color11" />
            onPress={() => onSelectMode(mode)}
          >
            <SizableText size="$1" fontWeight="600" color="$color11">
              {mode === "queue" ? `Queue (${tracksCount})` : label}
            </SizableText>
          </Button>
        );
      })}
    </XStack>
  );
});

export const PlayerControls = memo(function PlayerControls({
  trackDurationFallback,
  playing,
  playbackState,
  shuffleMode,
  repeatMode,
  onToggleShuffle,
  onCycleRepeat,
  viewMode,
  tracksCount,
  onSelectMode,
}: {
  trackDurationFallback?: number;
  playing: boolean;
  playbackState: PlaybackState;
  shuffleMode: boolean;
  repeatMode: RepeatMode;
  onToggleShuffle: () => void;
  onCycleRepeat: () => void;
  viewMode: ViewMode;
  tracksCount: number;
  onSelectMode: (mode: ViewMode) => void;
}) {
  return (
    <YStack width="100%" gap="$2" pt="$1.5">
      <PlayerScrubber trackDurationFallback={trackDurationFallback} />
      <PlayerTransport
        playing={playing}
        playbackState={playbackState}
        shuffleMode={shuffleMode}
        repeatMode={repeatMode}
        onToggleShuffle={onToggleShuffle}
        onCycleRepeat={onCycleRepeat}
      />
      <PlayerBottomNav viewMode={viewMode} tracksCount={tracksCount} onSelectMode={onSelectMode} />
    </YStack>
  );
});
