import { Link, Stack } from "expo-router";
import { H2, Image, Paragraph, SizableText, XStack, YStack } from "tamagui";

export default function NotFoundPage() {
  return (
    <>
      <Stack.Screen options={{ title: "Oops!" }} />
      <YStack bg="$background" flex={1} items="center" justify="center" gap="$4" p="$4">
        <Image src={require("../../assets/images/404.png")} width="100%" height="auto" />
        <H2 fontSize="$7" fontWeight="700">
          This page seems to be missing.
        </H2>
        <Paragraph color="$color11" size="$4" text="center">
          But, there are plenty of other great music!
          {"\n"}
          Try one of these:
        </Paragraph>
        <XStack>
          <Link href="/trending?type=song">
            <SizableText color="$blue10">Trending Songs</SizableText>
          </Link>
          <SizableText marginInline="$2">/</SizableText>
          <Link href="/latest?type=album">
            <SizableText color="$blue10">Latest Albums</SizableText>
          </Link>
          <SizableText marginInline="$2">/</SizableText>
          <Link href="/featured">
            <SizableText color="$blue10">Top Playlists</SizableText>
          </Link>
        </XStack>
      </YStack>
    </>
  );
}
