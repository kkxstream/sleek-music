import { addDatabaseChangeListener, useSQLiteContext, type SQLiteDatabase } from "expo-sqlite";
import { useEffect, useSyncExternalStore } from "react";

let favouriteIds = new Set<string>();
const listeners = new Set<() => void>();
let isListenerAttached = false;
let dbRef: SQLiteDatabase | null = null;

async function refreshFavouriteIds(db: SQLiteDatabase) {
  try {
    const rows = await db.getAllAsync<{ id: string }>("SELECT id FROM favourites");
    favouriteIds = new Set(rows.map((row) => row.id));
    listeners.forEach((listener) => listener());
  } catch {
    // Ignore error if database is not ready yet
  }
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot() {
  return favouriteIds;
}

export const useIsFavourited = (itemId?: string): boolean => {
  const db = useSQLiteContext();
  const favouritedSet = useSyncExternalStore(subscribe, getSnapshot);

  useEffect(() => {
    dbRef = db;
    if (!isListenerAttached) {
      isListenerAttached = true;
      refreshFavouriteIds(db);
      addDatabaseChangeListener((event) => {
        if (event.tableName === "favourites" && dbRef) {
          refreshFavouriteIds(dbRef);
        }
      });
    } else if (favouriteIds.size === 0) {
      refreshFavouriteIds(db);
    }
  }, [db]);

  if (!itemId) {
    return false;
  }

  return favouritedSet.has(itemId);
};
