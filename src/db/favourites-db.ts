import type { SQLiteDatabase } from "expo-sqlite";

export async function migrateDbIfNeeded(db: SQLiteDatabase) {
  const DATABASE_VERSION = 1;
  let { user_version: currentDbVersion } = (await db.getFirstAsync<{ user_version: number }>(
    "PRAGMA user_version",
  )) || { user_version: 0 };

  if (currentDbVersion >= DATABASE_VERSION) {
    return;
  }

  if (currentDbVersion === 0) {
    await db.execAsync(`
      PRAGMA journal_mode = 'wal';
      CREATE TABLE IF NOT EXISTS favourites (
        id TEXT PRIMARY KEY NOT NULL,
        title TEXT NOT NULL,
        subtitle TEXT,
        type TEXT CHECK (type IN ('song', 'album', 'artist', 'playlist', 'mix')),
        perma_url TEXT NOT NULL,
        image TEXT
      );
      CREATE INDEX IF NOT EXISTS idx_media_type ON favourites(type);
    `);

    currentDbVersion = 1;
  }

  await db.execAsync(`PRAGMA user_version = ${DATABASE_VERSION}`);
}
