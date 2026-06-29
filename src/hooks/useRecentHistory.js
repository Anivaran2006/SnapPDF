import { useCallback, useEffect, useState } from 'react';
import { clearHistoryItems, deleteHistoryItem, getHistoryItems } from '../services/historyService';

export function useRecentHistory() {
  const [items, setItems] = useState(() => getHistoryItems());

  const refresh = useCallback(() => {
    setItems(getHistoryItems());
  }, []);

  const deleteItem = useCallback((id) => {
    deleteHistoryItem(id);
    refresh();
  }, [refresh]);

  const clearAll = useCallback(() => {
    clearHistoryItems();
    refresh();
  }, [refresh]);

  useEffect(() => {
    const handleStorage = () => refresh();
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, [refresh]);

  return { items, refresh, deleteItem, clearAll };
}
