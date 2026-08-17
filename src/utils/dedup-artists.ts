import defaultArtistImage from "assets/images/default-artist.png"; //ignore
import type { ArtistBase } from "src/models";

import { toCapitalize } from "./to-capitalize";

export function dedupArtists(artists: ArtistBase[]): ArtistBase[] {
  const artistMap = new Map<string, ArtistBase>();

  for (const artist of artists) {
    if (artistMap.has(artist.id)) {
      const existingArtist = artistMap.get(artist.id)!;
      const roles = new Set([
        ...(existingArtist.role?.split(", ") || []),
        toCapitalize(artist.role),
      ]);
      existingArtist.role = [...roles].filter(Boolean).join(", ");
    } else {
      artistMap.set(artist.id, {
        ...artist,
        image: artist.image ?? defaultArtistImage,
      });
    }
  }

  return Array.from(artistMap.values());
}
