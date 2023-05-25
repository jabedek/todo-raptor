import { useState } from "react";
import { StorageItem } from "../types/enums";

/**
 * This hook allows to easily store and retrieve data from localStorage.
 * @returns methods to manage localStorage items
 */
export const useLocalStorage = (): LocalStorageCustomHook => {
  const [value, setValue] = useState<string | undefined>(undefined);

  const setItem = (key: StorageItem, value: string): void => {
    localStorage.setItem(key, value);
    setValue(value);
  };

  const getItem = (key: StorageItem): string | undefined => {
    const value = localStorage.getItem(key) ?? undefined;
    setValue(value);
    return value;
  };

  const removeItem = (key: StorageItem): void => {
    localStorage.removeItem(key);
    setValue(undefined);
  };

  return { value, setItem, getItem, removeItem };
};

type LocalStorageCustomHook = {
  value: string | undefined;
  setItem: (key: StorageItem, value: string) => void;
  getItem: (key: StorageItem) => string | undefined;
  removeItem: (key: StorageItem) => void;
};
