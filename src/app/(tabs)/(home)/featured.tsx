import { PlaylistFeaturedResponse } from "src/models";
import { GridView, MediaCard } from "src/ui";
import { apiFetcher, getLanguagesParam } from "src/utils";
import useSWR from "swr";
import { Paragraph, Spinner, YStack } from "tamagui";

export default function FeaturedPlaylistsPage() {
  const params = { languages: getLanguagesParam() };
  const { data, isLoading } = useSWR<PlaylistFeaturedResponse>(
    ["featured_playlists", params],
    apiFetcher,
  );

  if (isLoading) {
    return (
      <YStack bg="$background" flex={1} items="center" justify="center">
        <Spinner size="large" color="$blue10" />
      </YStack>
    );
  }

  if (!data) {
    return (
      <YStack bg="$background" flex={1} items="center" justify="center" gap="$3">
        <Paragraph size="$4" color="$color11">
          Data not found
        </Paragraph>
      </YStack>
    );
  }

  return (
    <YStack flex={1} bg="$background" px="$3" pt="$2">
      <GridView>
        {data?.data.map((playlist) => (
          <MediaCard
            key={playlist.id}
            title={playlist.title}
            subtitle={playlist.subtitle}
            image={playlist.image}
            perma_url={playlist.perma_url}
          />
        ))}
      </GridView>
    </YStack>
  );
}
