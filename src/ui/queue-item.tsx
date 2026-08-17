import TrackPlayer, { useActiveMediaItem } from "@rntp/player";
import {
  AudioWaveform as AudioWaveformIcon,
  Play as PlayIcon,
  X as ClearIcon,
} from "@tamagui/lucide-icons-2";
import { decodeHTML } from "entities";
import { memo } from "react";
import type { PlayerTrack } from "src/models";
import { Avatar, Button, ListItem, SizableText, YStack, ZStack } from "tamagui";

export const QueueItem = memo(function QueueItem({
  track,
  index,
}: {
  track: PlayerTrack;
  index: number;
}) {
  const activeTrack = useActiveMediaItem() as PlayerTrack | undefined;
  const isActive = Boolean(activeTrack?.mediaId && activeTrack.mediaId === track.mediaId);

  return (
    <ListItem
      group
      active={isActive}
      items="center"
      icon={
        <ZStack
          group
          width="$4"
          height="$4"
          items="center"
          justify="center"
          onPress={(e) => {
            e.stopPropagation();
            TrackPlayer.skipToIndex(index);
          }}
        >
          <Avatar size="$4" rounded="$2">
            <Avatar.Image src={track.artworkUrl?.toString()} />
            <Avatar.Fallback bg="$color4" rounded="$2" />
          </Avatar>
          <YStack
            fullscreen
            opacity={isActive ? 1 : 0}
            $group-hover={{ opacity: 1 }}
            bg="rgba(0, 0, 0, 0.55)"
            rounded="$2"
            items="center"
            justify="center"
            pointerEvents="none"
          >
            {isActive ? (
              <AudioWaveformIcon size={18} color="$blue10" />
            ) : (
              <PlayIcon size={16} color="white" fill="white" />
            )}
          </YStack>
        </ZStack>
      }
      title={
        <SizableText
          size="$3"
          fontWeight={isActive ? "700" : "500"}
          color={isActive ? "$blue10" : "$color12"}
          numberOfLines={1}
        >
          {decodeHTML(track.title || "")}
        </SizableText>
      }
      subTitle={decodeHTML(track.artist || "")}
      size="$3"
      py="$1"
      px="$2"
      bg={isActive ? "$color3" : "transparent"}
      hoverStyle={{ bg: "$color3" }}
      pressStyle={{ bg: "$color4", scale: 0.99 }}
      rounded="$3"
      iconAfter=<Button
        chromeless
        color="$color11"
        hoverStyle={{ opacity: 0.7 }}
        icon={ClearIcon}
        size="$3"
        onPress={(e) => {
          e.stopPropagation();
          TrackPlayer.removeMediaItem(index);
        }}
      />
    />
  );
});
