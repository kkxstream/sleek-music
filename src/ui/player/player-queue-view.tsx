import TrackPlayer from "@rntp/player";
import {
  Infinity as InfinityIcon,
  ListMusic as ListMusicIcon,
  Search as SearchIcon,
  Trash2 as TrashIcon,
  X as ClearTextIcon,
} from "@tamagui/lucide-icons-2";
import { memo } from "react";
import type { PlayerTrack } from "src/models";
import { QueueItem } from "src/ui/queue-item";
import {
  Button,
  H3,
  Input,
  Paragraph,
  Sheet,
  SizableText,
  View,
  XStack,
  YGroup,
  YStack,
} from "tamagui";

export const PlayerQueueView = memo(function PlayerQueueView({
  tracks,
  filteredTracks,
  queueSearch,
  autoplay,
  currentTrack,
  onSearchChange,
  onClearSearch,
  onToggleAutoplay,
}: {
  tracks: PlayerTrack[];
  filteredTracks: { track: PlayerTrack; originalIndex: number }[];
  queueSearch: string;
  autoplay: boolean;
  currentTrack: PlayerTrack | null;
  onSearchChange: (text: string) => void;
  onClearSearch: () => void;
  onToggleAutoplay: () => void;
}) {
  return (
    <YStack flex={1} width="100%" gap="$2">
      <XStack justify="space-between" items="center" width="100%" px="$1" pb="$1">
        <XStack items="center" gap="$2">
          <H3 fontSize="$5" fontWeight="700">
            Queue
          </H3>
          <View bg="$color4" px="$2" py="$0.5" rounded="$10">
            <SizableText size="$1" fontWeight="700" color="$color11">
              {tracks.length}
            </SizableText>
          </View>
        </XStack>

        <XStack items="center" gap="$2">
          <Button
            size="$2.5"
            rounded="$3"
            px="$2.5"
            bg={autoplay ? "$blue10" : "$color3"}
            chromeless={!autoplay}
            pressStyle={{ scale: 0.94 }}
            icon=<InfinityIcon size={14} color={autoplay ? "white" : "$color11"} />
            onPress={onToggleAutoplay}
          />

          <Button
            size="$2.5"
            rounded="$3"
            px="$2.5"
            bg="$color3"
            chromeless
            pressStyle={{ scale: 0.94 }}
            icon=<TrashIcon size={14} color="$color11" />
            onPress={() => {
              if (currentTrack) {
                TrackPlayer.setMediaItems([currentTrack]);
              }
            }}
          />
        </XStack>
      </XStack>

      <XStack items="center" bg="$color3" rounded="$3" px="$2.5" py="$1" gap="$2">
        <SearchIcon size={15} color="$color10" />
        <Input
          flex={1}
          placeholder="Search in queue..."
          placeholderTextColor="$color10"
          value={queueSearch}
          onChangeText={onSearchChange}
          size="$3"
          unstyled
          borderWidth={0}
          bg="transparent"
          color="$color12"
        />
        {queueSearch.length > 0 && (
          <Button
            size="$2"
            chromeless
            circular
            icon=<ClearTextIcon size={14} color="$color10" />
            onPress={onClearSearch}
          />
        )}
      </XStack>

      <Sheet.ScrollView
        flex={1}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ pb: 16 }}
      >
        {filteredTracks.length > 0 ? (
          <YGroup size="$4" bg="transparent">
            {filteredTracks.map(({ track, originalIndex }) => (
              <YGroup.Item key={originalIndex + (track.mediaId || "")}>
                <QueueItem track={track} index={originalIndex} />
              </YGroup.Item>
            ))}
          </YGroup>
        ) : (
          <YStack py="$10" items="center" justify="center" gap="$2">
            <ListMusicIcon size={32} color="$color9" />
            <Paragraph color="$color11" size="$3">
              {queueSearch ? "No matching songs found in queue" : "Queue is empty"}
            </Paragraph>
          </YStack>
        )}
      </Sheet.ScrollView>
    </YStack>
  );
});
