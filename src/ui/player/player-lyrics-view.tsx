import { LetterText as LetterTextIcon } from "@tamagui/lucide-icons-2";
import { decodeHTML } from "entities";
import { memo } from "react";
import type { PlayerTrack } from "src/models";
import { H3, Paragraph, Separator, Sheet, XStack, YStack } from "tamagui";

const LyricView = memo(function LyricView({ lines }: { lines: string[] }) {
  return (
    <YStack my="$3" gap="$1.5">
      {lines.map((line, i) => (
        <Paragraph
          key={i}
          fontSize="$5"
          fontWeight="600"
          text="center"
          lineHeight="$5"
          color="$color12"
          $sm={{ fontSize: "$4", lineHeight: "$4" }}
        >
          {line}
        </Paragraph>
      ))}
    </YStack>
  );
});

export const PlayerLyricsView = memo(function PlayerLyricsView({
  track,
  lyrics,
}: {
  track: PlayerTrack;
  lyrics: string[][] | undefined;
}) {
  return (
    <YStack flex={1} width="100%" gap="$2">
      <XStack justify="space-between" items="center" width="100%" px="$2" pb="$1">
        <H3 fontSize="$5" fontWeight="700">
          Lyrics
        </H3>
        <Paragraph color="$color11" size="$2" numberOfLines={1} maxW={200}>
          {decodeHTML(track.title || "")}
        </Paragraph>
      </XStack>
      <Separator />

      <Sheet.ScrollView
        flex={1}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ py: 16, px: 12 }}
      >
        {lyrics && lyrics.length > 0 ? (
          lyrics.map((lines, idx) => <LyricView key={idx} lines={lines} />)
        ) : (
          <YStack py="$10" items="center" justify="center" gap="$2">
            <LetterTextIcon size={32} color="$color9" />
            <Paragraph color="$color11" size="$3">
              No lyrics available for this song
            </Paragraph>
          </YStack>
        )}
      </Sheet.ScrollView>
    </YStack>
  );
});
