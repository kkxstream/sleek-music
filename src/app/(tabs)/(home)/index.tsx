import { ArrowRight as ArrowRightIcon } from "@tamagui/lucide-icons-2";
import { Link, type RelativePathString } from "expo-router";
import { LaunchDataResponse } from "src/models";
import { ContentRails } from "src/ui";
import { groupBy, apiFetcher, usePreferenceStore } from "src/utils";
import useSWR from "swr";
import { Button, Paragraph, ScrollView, Spinner, YStack } from "tamagui";

export default function ExplorePage() {
  const { languages } = usePreferenceStore();
  const { data, error, isLoading, mutate } = useSWR<LaunchDataResponse>(
    ["launch_data", { languages }],
    apiFetcher,
  );
  const trending = groupBy(data?.new_trending, (item) => item.type);
  const latest = groupBy(data?.new_albums, (item) => item.type);

  if (isLoading) {
    return (
      <YStack bg="$background" flex={1} items="center" justify="center">
        <Spinner size="large" color="$blue10" />
      </YStack>
    );
  }

  if (error || !data) {
    return (
      <YStack bg="$background" flex={1} items="center" justify="center" gap="$3" p="$4">
        <Paragraph size="$3" color="$color11" text="center">
          Unable to load explore data. Please check your internet connection.
        </Paragraph>
        <Button
          size="$3"
          bg="$blue10"
          color="white"
          rounded="$10"
          px="$4"
          fontWeight="600"
          pressStyle={{ scale: 0.96 }}
          onPress={() => mutate()}
        >
          Try Again
        </Button>
      </YStack>
    );
  }

  const contents = [
    {
      id: "trending-songs",
      more: <MoreLink path="/trending?type=song" />,
      heading: "Trending Songs",
      items: trending.song,
    },
    {
      id: "trending-albums",
      more: <MoreLink path="/trending?type=album" />,
      heading: "Trending Albums",
      items: trending.album,
    },
    {
      id: "trending-playlists",
      more: <MoreLink path="/trending?type=playlist" />,
      heading: "Trending Playlists",
      items: trending.playlist,
    },
    {
      id: "editorial-picks",
      more: <MoreLink path="/featured" />,
      heading: "Editorial Picks",
      items: data?.top_playlists,
    },
    {
      id: "latest-songs",
      more: <MoreLink path="/latest?type=song" />,
      heading: "Latest Songs",
      items: latest.song,
    },
    {
      id: "latest-albums",
      more: <MoreLink path="/latest?type=album" />,
      heading: "Latest Albums",
      items: latest.album,
    },
    {
      id: "top-charts",
      heading: "Top Charts",
      items: data?.charts,
    },
    {
      id: "spotlight-artists",
      heading: "Spotlight Artists",
      items: data?.artist_recos,
    },
    {
      id: "mood-mixes",
      heading: "Mood Mixes",
      items: data?.tag_mixes,
    },
  ];

  return (
    <ScrollView
      px="$3"
      contentContainerStyle={{ pb: 120, pt: 4 }}
      bg="$background"
      showsVerticalScrollIndicator={false}
    >
      <ContentRails data={contents} />
    </ScrollView>
  );
}

function MoreLink({ path }: { path: string }) {
  return (
    <Link href={path as RelativePathString} asChild>
      <Button
        size="$2"
        chromeless
        iconAfter={ArrowRightIcon}
        color="$blue10"
        fontWeight="600"
        hoverStyle={{ opacity: 0.8 }}
        pressStyle={{ opacity: 0.7 }}
      >
        View more
      </Button>
    </Link>
  );
}
