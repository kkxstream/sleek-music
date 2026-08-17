import TrackPlayer from "@rntp/player";
import type { IconProps } from "@tamagui/helpers-icon";
import {
  Heart as HeartOffIcon,
  HeartPlus as HeartPlusIcon,
  ListPlus as ListPlusIcon,
  Play as PlayIcon,
  Share2 as ShareIcon,
} from "@tamagui/lucide-icons-2";
import { decodeHTML } from "entities";
import { useSQLiteContext, type SQLiteDatabase } from "expo-sqlite";
import type { JSX, ReactNode } from "react";
import { Share } from "react-native";
import { toggleFavourite, useIsFavourited } from "src/db";
import type { FavouriteItem, Song } from "src/models";
import { createTrack } from "src/utils";
import { Button, type ColorTokens, H1, Image, Paragraph, XStack, YStack } from "tamagui";

type IconComponent = (propsIn: IconProps) => JSX.Element;

const ActionButton = ({
  Icon,
  onPress,
  color,
  label,
  bg = "$color3",
}: {
  Icon: IconComponent;
  onPress: () => void;
  color?: ColorTokens;
  label?: string;
  bg?: ColorTokens;
}) => (
  <Button
    icon=<Icon size={18} color={color} />
    circular
    size="$3"
    bg={bg}
    borderWidth={1}
    borderColor="$borderColor"
    hoverStyle={{ opacity: 0.85, bg: "$color4" }}
    pressStyle={{ scale: 0.94, opacity: 0.85 }}
    onPress={onPress}
  />
);

export interface HeroBannerProps extends FavouriteItem {
  showImage?: boolean;
  songs: Song[];
  children?: ReactNode;
}

export function HeroBanner({
  id,
  title,
  subtitle = "",
  image,
  type,
  showImage = true,
  songs,
  perma_url,
  children: stats,
}: HeroBannerProps) {
  const db = useSQLiteContext();
  const isFavourite = useIsFavourited(id);
  const item: FavouriteItem = { id, title, subtitle, image, type, perma_url };
  const isArtist = type === "artist";

  return (
    <YStack
      mt="$1"
      mb="$1.5"
      p="$3"
      bg="$color2"
      borderWidth={1}
      borderColor="$borderColor"
      rounded="$4"
      elevation="$2"
      gap="$2.5"
    >
      {showImage && (
        <YStack position="relative" items="center" justify="center" my="$1">
          <YStack
            position="absolute"
            width={190}
            height={190}
            rounded={isArtist ? "$10" : "$4"}
            bg="$blue10"
            opacity={0.2}
            elevation="$4"
            shadowColor="$blue10"
            shadowRadius={24}
            shadowOffset={{ width: 0, height: 4 }}
            shadowOpacity={0.4}
          />
          <YStack
            elevation="$3"
            rounded={isArtist ? "$10" : "$4"}
            overflow="hidden"
            borderWidth={1}
            borderColor="$borderColor"
          >
            <Image
              src={image.replace(/(?:50|150)x(?:50|150)\.jpg/g, "250x250.jpg")}
              width={200}
              height={200}
              rounded={isArtist ? "$10" : "$4"}
            />
          </YStack>
        </YStack>
      )}

      <YStack gap="$1">
        <H1 fontSize="$6" fontWeight="800" $sm={{ fontSize: "$5" }}>
          {decodeHTML(title)}
        </H1>
        {subtitle && (
          <Paragraph color="$color11" size="$2" fontWeight="500">
            {decodeHTML(subtitle)}
          </Paragraph>
        )}
      </YStack>

      {stats}

      <XStack gap="$2.5" py="$0.5" items="center">
        {!!songs.length && (
          <Button
            icon=<PlayIcon size={16} color="white" fill="white" />
            bg="$blue10"
            color="white"
            rounded="$10"
            size="$4"
            px="$4"
            fontWeight="700"
            hoverStyle={{ bg: "$blue11" }}
            pressStyle={{ scale: 0.96, opacity: 0.9 }}
            onPress={() => playSongs(songs)}
          >
            Play
          </Button>
        )}
        {!!songs.length && (
          <ActionButton Icon={ListPlusIcon} onPress={() => addSongsToQueue(songs)} />
        )}
        <ActionButton
          Icon={isFavourite ? HeartOffIcon : HeartPlusIcon}
          color={isFavourite ? "$blue10" : undefined}
          onPress={() => toggleSaveFavourite(db, item)}
        />
        <ActionButton Icon={ShareIcon} onPress={() => shareLink(perma_url)} />
      </XStack>
    </YStack>
  );
}

function playSongs(songs: Song[]) {
  if (!songs.length) {
    return;
  }
  const tracks = songs.map((song) => createTrack(song));
  TrackPlayer.setMediaItems(tracks);
  TrackPlayer.play();
}

function addSongsToQueue(songs: Song[]) {
  if (!songs.length) {
    return;
  }
  const tracks = songs.map((song) => createTrack(song));
  TrackPlayer.addMediaItems(tracks);
}

async function toggleSaveFavourite(db: SQLiteDatabase, item: FavouriteItem) {
  await toggleFavourite(db, item);
}

function shareLink(url: string) {
  Share.share({ message: url });
}
