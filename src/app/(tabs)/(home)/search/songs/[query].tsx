import { useLocalSearchParams } from "expo-router";
import { useCallback } from "react";
import { FlatList } from "react-native";
import type { SearchSongResponse } from "src/models";
import { MediaListItem } from "src/ui";
import { apiFetcher } from "src/utils";
import useSWRInfinite from "swr/infinite";
import { Paragraph, Spinner, YStack } from "tamagui";

export default function SongSearchPage() {
  const { query } = useLocalSearchParams();

  const { data, error, isLoading, isValidating, size, setSize } =
    useSWRInfinite<SearchSongResponse>(getKey, apiFetcher);

  function getKey(page: number, prevPageData: SearchSongResponse) {
    if (prevPageData && prevPageData.results?.length === 0) {
      return null;
    }
    return ["song_search", { q: query, p: page + 1 }];
  }

  const results = data?.flatMap((page) => page?.results ?? []) ?? [];

  const renderItem = useCallback(
    ({ item }: { item: SearchSongResponse["results"][number] }) => <MediaListItem {...item} />,
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
          No songs found for "{query}"
        </Paragraph>
      </YStack>
    );
  }

  return (
    <FlatList
      data={results}
      keyExtractor={(item, index) => `${item.id}_${index}`}
      renderItem={renderItem}
      contentContainerStyle={{ paddingBottom: 100 }}
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
