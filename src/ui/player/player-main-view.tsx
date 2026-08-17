import {
  Heart as HeartIcon,
  HeartPlus as HeartPlusIcon,
  Share2 as ShareIcon,
} from "@tamagui/lucide-icons-2";
import { decodeHTML } from "entities";
import { Link, type RelativePathString } from "expo-router";
import type { SQLiteDatabase } from "expo-sqlite";
import { memo } from "react";
import { Share } from "react-native";
import { toggleFavourite } from "src/db";
import type { FavouriteItem, PlayerTrack } from "src/models";
import { parsePath } from "src/utils";
import { Button, H2, Image, Paragraph, XStack, YStack } from "tamagui";

export const PlayerMainView = memo(function PlayerMainView({
  track,
  favouriteItem,
  isFavourite,
  db,
  onDismiss,
  onOpenLyrics,
}: {
  track: PlayerTrack;
  favouriteItem: FavouriteItem;
  isFavourite: boolean;
  db: SQLiteDatabase;
  onDismiss: () => void;
  onOpenLyrics: () => void;
}) {
  return (
    <YStack flex={1} justify="space-evenly" items="center" width="100%" py="$1">
      <YStack position="relative" items="center" justify="center" my="$1">
        <YStack
          position="absolute"
          width={240}
          height={240}
          $sm={{ width: 190, height: 190 }}
          rounded="$10"
          bg="$blue10"
          opacity={0.25}
          elevation="$5"
          shadowColor="$blue10"
          shadowRadius={28}
          shadowOffset={{ width: 0, height: 4 }}
          shadowOpacity={0.45}
        />
        <YStack
          elevation="$4"
          shadowColor="$shadowColor"
          shadowRadius={16}
          shadowOffset={{ width: 0, height: 8 }}
          shadowOpacity={0.3}
          rounded="$4"
          overflow="hidden"
          pressStyle={{ scale: 0.98 }}
          onPress={onOpenLyrics}
        >
          <Image
            src={track.artworkUrl?.toString()}
            rounded="$4"
            width={280}
            height={280}
            $sm={{ width: 230, height: 230 }}
          />
        </YStack>
      </YStack>

      <XStack justify="space-between" items="center" width="100%" px="$2" pt="$1">
        <YStack flex={1} overflow="hidden" pr="$2">
          <Link href={parsePath(track.extras.permaUrl) as RelativePathString} onPress={onDismiss}>
            <H2 fontSize="$5" fontWeight="700" numberOfLines={1} $sm={{ fontSize: "$4" }}>
              {decodeHTML(track.title || "")}
            </H2>
          </Link>
          <Paragraph color="$color11" size="$2" numberOfLines={1} pt="$0.5">
            {decodeHTML(track.artist || "")}
          </Paragraph>
        </YStack>

        <XStack items="center" gap="$1">
          <Button
            icon={isFavourite ? HeartIcon : HeartPlusIcon}
            color={isFavourite ? "$blue10" : "$color11"}
            scaleIcon={1.3}
            chromeless
            circular
            size="$3.5"
            pressStyle={{ scale: 0.88 }}
            onPress={async () => await toggleFavourite(db, favouriteItem)}
          />
          <Button
            icon={ShareIcon}
            color="$color11"
            scaleIcon={1.3}
            chromeless
            circular
            size="$3.5"
            pressStyle={{ scale: 0.88 }}
            onPress={async () => {
              await Share.share({ message: track.extras.permaUrl });
            }}
          />
        </XStack>
      </XStack>
    </YStack>
  );
});
