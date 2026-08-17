import { Redirect, type RelativePathString, useLocalSearchParams } from "expo-router";
import type { MixDetailResponse } from "src/models";
import { HeroBanner, MediaListItem } from "src/ui";
import { apiFetcher, durationOfList } from "src/utils";
import useSWR from "swr";
import { ScrollView, Separator, SizableText, Spinner, XStack, YGroup, YStack } from "tamagui";

export default function MixPage() {
  const { token } = useLocalSearchParams();
  const { data, error, isLoading } = useSWR<MixDetailResponse>(
    ["mix_detail", { token }],
    apiFetcher,
  );

  if (isLoading) {
    return (
      <YStack bg="$background" flex={1} items="center" justify="center">
        <Spinner size="large" color="$blue10" />
      </YStack>
    );
  }

  if (error || !data) {
    return <Redirect href={"/404" as RelativePathString} />;
  }

  return (
    <ScrollView
      px="$3"
      contentContainerStyle={{ pb: 100 }}
      bg="$background"
      showsVerticalScrollIndicator={false}
    >
      <HeroBanner
        id={data.id}
        title={data.title}
        subtitle={data.header_desc}
        type="playlist"
        image={data.image}
        perma_url={data.perma_url}
        songs={data.list}
      >
        <XStack items="center" gap="$1">
          <SizableText size="$1" color="$color11">
            {durationOfList(data.list)}
          </SizableText>
        </XStack>
      </HeroBanner>
      <Separator my="$2" />
      <YGroup size="$4">
        {data.list.map((song, index) => (
          <YGroup.Item key={song.id}>
            <MediaListItem {...song} trackNumber={index + 1} />
          </YGroup.Item>
        ))}
      </YGroup>
    </ScrollView>
  );
}
