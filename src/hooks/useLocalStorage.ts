import { StorageItem } from "@@types/common";
import { useState } from "react";

/**
 * This hook allows to easily store and retrieve data from localStorage.
 * @returns methods to manage localStorage items
 */
export const useLocalStorage = () => {
  const [value, setValue] = useState<string | undefined>(undefined);

  const setItem = (key: StorageItem, value: string) => {
    localStorage.setItem(key, value);
    setValue(value);
  };

  const getItem = (key: StorageItem) => {
    const value = localStorage.getItem(key);
    setValue(value ?? undefined);
    return value;
  };

  const removeItem = (key: StorageItem) => {
    localStorage.removeItem(key);
    setValue(undefined);
  };

  return { value, setItem, getItem, removeItem };
};
