import type { SQLiteDatabase } from "expo-sqlite";
import type { FavouriteItem } from "src/models";

export async function toggleFavourite(db: SQLiteDatabase, item: FavouriteItem): Promise<boolean> {
  const { id, title, subtitle, type, perma_url, image } = item;

  const existing = await db.getFirstAsync<{ id: string }>(
    "SELECT id FROM favourites WHERE id = ?",
    [id],
  );

  if (existing) {
    await db.runAsync("DELETE FROM favourites WHERE id = ?", [id]);
    return false;
  } else {
    await db.runAsync(
      "INSERT INTO favourites (id, title, subtitle, type, perma_url, image) VALUES (?, ?, ?, ?, ?, ?)",
      [id, title, subtitle ?? "", type, perma_url, image ?? ""],
    );
    return true;
  }
}
