import { useState } from "react";

import { Enums } from "@@types";

/**
 * This hook allows to easily store and retrieve data from localStorage.
 * @returns methods to manage localStorage items
 */
export const useLocalStorage = () => {
  const [value, setValue] = useState<string | undefined>(undefined);

  const setItem = (key: Enums.StorageItem, value: string) => {
    localStorage.setItem(key, value);
    setValue(value);
  };

  const getItem = (key: Enums.StorageItem) => {
    const value = localStorage.getItem(key);
    setValue(value ?? undefined);
    return value;
  };

  const removeItem = (key: Enums.StorageItem) => {
    localStorage.removeItem(key);
    setValue(undefined);
  };

  return { value, setItem, getItem, removeItem };
};
