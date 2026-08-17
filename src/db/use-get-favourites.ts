import { addDatabaseChangeListener, useSQLiteContext } from "expo-sqlite";
import { useEffect, useCallback, useState } from "react";
import type { FavouriteItem } from "src/models";

export const useGetFavourites = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [items, setItems] = useState<FavouriteItem[]>([]);

  const db = useSQLiteContext();

  const fetchItems = useCallback(async () => {
    try {
      setIsLoading(true);
      const results = await db.getAllAsync<FavouriteItem>(
        "SELECT id, title, subtitle, perma_url, type, image FROM favourites ORDER BY rowid DESC",
      );
      setItems(results);
    } catch {
      setItems([]);
    } finally {
      setIsLoading(false);
    }
  }, [db]);

  useEffect(() => {
    fetchItems();
    const databaseSubscription = addDatabaseChangeListener((event) => {
      if (event.tableName === "favourites") {
        fetchItems();
      }
    });
    return () => databaseSubscription.remove();
  }, [fetchItems]);

  return { items, isLoading, refresh: fetchItems };
};
