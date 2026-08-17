import { useActiveMediaItem, useIsPlaying, usePlaybackState } from "@rntp/player";
import { ChevronDown as ChevronDownIcon } from "@tamagui/lucide-icons-2";
import { decodeHTML } from "entities";
import { useSQLiteContext } from "expo-sqlite";
import { useMemo, useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useIsFavourited } from "src/db";
import type { FavouriteItem, LyricsResponse, PlayerTrack } from "src/models";
import { useQueueTracks, useRepeatMode, useShuffleMode } from "src/player";
import {
  PlayerControls,
  PlayerLyricsView,
  PlayerMainView,
  PlayerQueueView,
  type ViewMode,
} from "src/ui/player";
import { apiFetcher, usePlayerSheetStore, usePreferenceStore } from "src/utils";
import useSWRImmutable from "swr/immutable";
import { Button, Sheet, XStack, YStack } from "tamagui";

export function PlayerSheet() {
  const insets = useSafeAreaInsets();
  const { isOpen, setOpen } = usePlayerSheetStore();
  const { autoplay, setAutoplay } = usePreferenceStore();
  const track = useActiveMediaItem() as PlayerTrack | null;
  const tracks = useQueueTracks() as PlayerTrack[];
  const playing = useIsPlaying();
  const playbackState = usePlaybackState();
  const { repeatMode, cycleRepeatMode } = useRepeatMode();
  const { shuffleMode, toggleShuffleMode } = useShuffleMode();
  const isFavourite = useIsFavourited(track?.extras?.saavnId);
  const db = useSQLiteContext();

  const [viewMode, setViewMode] = useState<ViewMode>("player");
  const [queueSearch, setQueueSearch] = useState("");

  const { data } = useSWRImmutable<LyricsResponse>(
    track?.extras?.hasLyrics && track?.extras?.saavnId
      ? ["song_lyrics", { lyrics_id: track.extras.saavnId }]
      : null,
    apiFetcher,
  );

  const lyrics = useMemo(
    () =>
      decodeHTML(data?.lyrics || "")
        ?.split("<br><br>")
        .map((stanza) =>
          stanza
            .split("<br>")
            .map((line) => line.trim())
            .filter(Boolean),
        ),
    [data?.lyrics],
  );

  const favouriteItem = useMemo<FavouriteItem | null>(() => {
    if (!track) {
      return null;
    }
    return {
      id: track.extras.saavnId,
      title: track.title ?? "",
      subtitle: track.artist ?? "",
      image: track.artworkUrl?.toString() ?? "",
      type: "song",
      perma_url: track.extras.permaUrl,
    };
  }, [track]);

  const filteredTracks = useMemo(() => {
    return tracks
      .map((trackItem, originalIndex) => ({ track: trackItem, originalIndex }))
      .filter(({ track: queueTrack }) => {
        if (!queueSearch.trim()) {
          return true;
        }
        const query = queueSearch.toLowerCase();
        return (
          queueTrack.title?.toLowerCase().includes(query) ||
          queueTrack.artist?.toLowerCase().includes(query)
        );
      });
  }, [tracks, queueSearch]);

  if (!track || !favouriteItem) {
    return null;
  }

  return (
    <Sheet
      modal
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          setViewMode("player");
          setQueueSearch("");
        }
        setOpen(open);
      }}
      snapPoints={[97]}
      dismissOnSnapToBottom
      zIndex={100000}
      // @ts-expect-error Tamagui Sheet runtime supports animation prop
      animation="medium"
    >
      <Sheet.Overlay
        // @ts-expect-error Tamagui Sheet.Overlay runtime supports animation prop
        animation="lazy"
        bg="rgba(0, 0, 0, 0.75)"
        enterStyle={{ opacity: 0 }}
        exitStyle={{ opacity: 0 }}
      />
      <Sheet.Handle bg="$color7" />
      <Sheet.Frame
        flex={1}
        bg="$background"
        borderTopLeftRadius="$6"
        borderTopRightRadius="$6"
        borderTopWidth={1}
        borderTopColor="$borderColor"
        p="$3.5"
        pb={Math.max(insets.bottom, 20)}
        gap="$2"
      >
        <YStack flex={1} width="100%" justify="space-between">
          <XStack justify="flex-start" items="center" width="100%" pb="$1">
            <Button
              icon={ChevronDownIcon}
              circular
              chromeless
              size="$3.5"
              color="$color11"
              pressStyle={{ scale: 0.92 }}
              onPress={() => setOpen(false)}
            />
          </XStack>

          {viewMode === "player" && (
            <PlayerMainView
              track={track}
              favouriteItem={favouriteItem}
              isFavourite={isFavourite}
              db={db}
              onDismiss={() => setOpen(false)}
              onOpenLyrics={() => setViewMode("lyrics")}
            />
          )}

          {viewMode === "lyrics" && <PlayerLyricsView track={track} lyrics={lyrics} />}

          {viewMode === "queue" && (
            <PlayerQueueView
              tracks={tracks}
              filteredTracks={filteredTracks}
              queueSearch={queueSearch}
              autoplay={autoplay}
              currentTrack={track}
              onSearchChange={setQueueSearch}
              onClearSearch={() => setQueueSearch("")}
              onToggleAutoplay={() => {
                setAutoplay(!autoplay);
              }}
            />
          )}

          <PlayerControls
            trackDurationFallback={Number(track?.duration) || 0}
            playing={playing}
            playbackState={playbackState}
            shuffleMode={shuffleMode}
            repeatMode={repeatMode}
            onToggleShuffle={toggleShuffleMode}
            onCycleRepeat={cycleRepeatMode}
            viewMode={viewMode}
            tracksCount={tracks.length}
            onSelectMode={setViewMode}
          />
        </YStack>
      </Sheet.Frame>
    </Sheet>
  );
}
