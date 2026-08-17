import { decodeHTML } from "entities";
import { Link, type RelativePathString } from "expo-router";
import { memo } from "react";
import { parsePath } from "src/utils";
import { Avatar, Card, Paragraph, Text } from "tamagui";

export type MediaCardProps = {
  title: string;
  subtitle?: string;
  image: string;
  perma_url: string;
  circle?: boolean;
};

export const MediaCard = memo(function MediaCard({
  title,
  subtitle,
  image,
  perma_url,
  circle,
}: MediaCardProps) {
  const isCircle = circle || /\/artist\//i.test(perma_url);

  return (
    <Link href={parsePath(perma_url) as RelativePathString} asChild>
      <Card
        group
        width={132}
        rounded="$3"
        alignItems="center"
        hoverStyle={{ opacity: 0.88 }}
        pressStyle={{ opacity: 0.75, scale: 0.98 }}
        bg="transparent"
        p="$0"
        $md={{ width: 114 }}
        $sm={{ width: 98 }}
      >
        <Card.Header items="center" p="$0" pb="$1.5">
          <Avatar
            circular={isCircle}
            rounded={isCircle ? undefined : "$3"}
            size="$9"
            $md={{ size: "$8" }}
            $sm={{ size: "$7" }}
          >
            <Avatar.Image src={image} />
            <Avatar.Fallback bg="$color4" rounded={isCircle ? undefined : "$3"} />
          </Avatar>
        </Card.Header>

        <Card.Footer items="center" p="$0" width="100%">
          <Text
            fontSize="$3"
            fontWeight="600"
            lineHeight="$3"
            text="center"
            numberOfLines={1}
            px="$0.5"
            width="100%"
            $sm={{ fontSize: "$2" }}
            $group-hover={{ color: "$blue10" }}
            $group-press={{ color: "$blue9" }}
          >
            {decodeHTML(title)}
          </Text>
        </Card.Footer>

        {subtitle && (
          <Paragraph
            text="center"
            numberOfLines={1}
            px="$0.5"
            width="100%"
            size="$1"
            color="$color11"
            mt="$0.5"
          >
            {decodeHTML(subtitle)}
          </Paragraph>
        )}
      </Card>
    </Link>
  );
});
