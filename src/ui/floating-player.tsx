import TrackPlayer, {
  PlaybackState,
  useActiveMediaItem,
  useIsPlaying,
  usePlaybackState,
  useProgress,
} from "@rntp/player";
import { Pause as PauseIcon, Play as PlayIcon } from "@tamagui/lucide-icons-2";
import { decodeHTML } from "entities";
import { memo, useMemo } from "react";
import { PanResponder } from "react-native";
import { usePlayerSheetStore } from "src/utils";
import { Avatar, Button, Card, H4, Paragraph, Progress, Spinner, XStack, YStack } from "tamagui";

const FloatingProgressBar = memo(function FloatingProgressBar({
  durationFallback,
}: {
  durationFallback?: number;
}) {
  const { position, duration } = useProgress(0.25);
  const totalDuration = duration > 0 ? duration : durationFallback || 0;
  const progressPercent =
    totalDuration > 0 ? Math.min(100, Math.max(0, (position / totalDuration) * 100)) : 0;

  return (
    <Progress value={progressPercent} max={100} height={2} rounded="$0" bg="$color4">
      <Progress.Indicator bg="$blue10" />
    </Progress>
  );
});

export function FloatingPlayer() {
  const playing = useIsPlaying();
  const playbackState = usePlaybackState();
  const { setOpen } = usePlayerSheetStore();
  const track = useActiveMediaItem();

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onMoveShouldSetPanResponder: (_, gestureState) =>
          Math.abs(gestureState.dx) > 20 &&
          Math.abs(gestureState.dx) > Math.abs(gestureState.dy) * 1.5,
        onPanResponderRelease: (_, gestureState) => {
          if (gestureState.dx < -30) {
            TrackPlayer.skipToNext();
          } else if (gestureState.dx > 30) {
            TrackPlayer.skipToPrevious();
          }
        },
      }),
    [],
  );

  if (!track) {
    return null;
  }

  return (
    <Card
      {...panResponder.panHandlers}
      elevation="$2"
      borderWidth={1}
      borderColor="$borderColor"
      bg="$color2"
      rounded="$3"
      mx="$2.5"
      mb="$1.5"
      overflow="hidden"
      pressStyle={{ opacity: 0.9, scale: 0.99 }}
      onPress={() => setOpen(true)}
    >
      <XStack items="center" justify="space-between" gap="$2.5" p="$2">
        <Avatar size="$4" rounded="$2">
          <Avatar.Image src={track.artworkUrl?.toString()} />
          <Avatar.Fallback bg="$color4" rounded="$2" />
        </Avatar>

        <YStack flex={1} overflow="hidden">
          <H4 fontSize="$3" fontWeight="600" numberOfLines={1} $sm={{ fontSize: "$2" }}>
            {decodeHTML(track.title || "")}
          </H4>
          <Paragraph size="$1" color="$color11" numberOfLines={1} mt="$0.5">
            {decodeHTML(track.artist || "")}
          </Paragraph>
        </YStack>

        <Button
          icon={
            playbackState === PlaybackState.Buffering ? (
              <Spinner size="small" color="$blue10" />
            ) : playing ? (
              PauseIcon
            ) : (
              PlayIcon
            )
          }
          color="$blue10"
          chromeless
          circular
          size="$3"
          pressStyle={{ scale: 0.92 }}
          disabled={playbackState === PlaybackState.Buffering}
          onPress={(e) => {
            e.stopPropagation();
            if (playing) {
              TrackPlayer.pause();
            } else {
              TrackPlayer.play();
            }
          }}
        />
      </XStack>

      <FloatingProgressBar durationFallback={Number(track.duration) || 0} />
    </Card>
  );
}
