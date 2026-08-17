import { ArrowRight as ArrowRightIcon } from "@tamagui/lucide-icons-2";
import { Link, type RelativePathString, useLocalSearchParams } from "expo-router";
import type { AutoSearchResponse } from "src/models";
import { ContentRails } from "src/ui";
import { apiFetcher } from "src/utils";
import useSWR from "swr";
import { Button, Paragraph, ScrollView, Spinner, YStack } from "tamagui";

export default function SearchPage() {
  const { query } = useLocalSearchParams();
  const { data, error, isLoading } = useSWR<AutoSearchResponse>(
    ["auto_search", { query }],
    apiFetcher,
  );

  if (isLoading) {
    return (
      <YStack flex={1} items="center" justify="center">
        <Spinner size="large" color="$blue10" />
      </YStack>
    );
  }

  if (!data || error) {
    return (
      <YStack flex={1} items="center" justify="center" gap="$3">
        <Paragraph size="$3" color="$color11">
          No results found for "{query}"
        </Paragraph>
      </YStack>
    );
  }

  const results = [
    {
      id: "top-results",
      heading: "Top results",
      items: data?.topquery?.data?.filter((item) => item.type !== "artist"),
    },
    {
      id: "songs",
      more: <MoreLink path={`/search/songs/${query}`} />,
      heading: "Songs",
      items: data?.songs?.data,
    },
    {
      id: "albums",
      more: <MoreLink path={`/search/albums/${query}`} />,
      heading: "Albums",
      items: data?.albums?.data,
    },
    {
      id: "playlists",
      more: <MoreLink path={`/search/playlists/${query}`} />,
      heading: "Playlists",
      items: data?.playlists?.data,
    },
  ];

  return (
    <ScrollView contentContainerStyle={{ pb: 100 }} showsVerticalScrollIndicator={false}>
      <ContentRails data={results} />
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
