import { useLocalSearchParams } from "expo-router";
import { useCallback } from "react";
import { FlatList } from "react-native";
import type { SearchPlaylistResponse } from "src/models";
import { MediaCard } from "src/ui";
import { apiFetcher } from "src/utils";
import useSWRInfinite from "swr/infinite";
import { Paragraph, Spinner, YStack } from "tamagui";

export default function PlaylistSearchPage() {
  const { query } = useLocalSearchParams();

  const { data, error, isLoading, isValidating, size, setSize } =
    useSWRInfinite<SearchPlaylistResponse>(getKey, apiFetcher);

  function getKey(page: number, prevPageData: SearchPlaylistResponse) {
    if (prevPageData && prevPageData.results?.length === 0) {
      return null;
    }
    return ["playlist_search", { q: query, p: page + 1 }];
  }

  const results = data?.flatMap((page) => page?.results ?? []) ?? [];

  const renderItem = useCallback(
    ({ item: playlist }: { item: SearchPlaylistResponse["results"][number] }) => (
      <MediaCard
        title={playlist.title}
        subtitle={playlist.subtitle}
        image={playlist.image}
        perma_url={playlist.perma_url}
      />
    ),
    [],
  );

  if (isLoading) {
    return (
      <YStack flex={1} items="center" justify="center">
        <Spinner size="large" color="$blue10" />
      </YStack>
    );
  }

  if (error || results.length === 0) {
    return (
      <YStack flex={1} items="center" justify="center" gap="$3">
        <Paragraph size="$3" color="$color11">
          No playlists found for "{query}"
        </Paragraph>
      </YStack>
    );
  }

  return (
    <FlatList
      data={results}
      keyExtractor={(item, index) => `${item.id}_${index}`}
      numColumns={2}
      columnWrapperStyle={{
        justifyContent: "space-around",
        gap: 12,
      }}
      contentContainerStyle={{ paddingBottom: 100 }}
      renderItem={renderItem}
      onEndReached={() => setSize(size + 1)}
      onEndReachedThreshold={0.5}
      ListFooterComponent={
        isValidating && results.length > 0 ? (
          <YStack items="center" py="$3">
            <Spinner size="large" color="$blue10" />
          </YStack>
        ) : null
      }
    />
  );
}
