import { CallbackFn } from "frotsi";
import React, { useRef, useEffect } from "react";

/**
 * Hook that alerts clicks outside of the passed ref
 */
export function useHandleClickOutside<T extends HTMLElement>(ref: React.RefObject<T>, cb: CallbackFn) {
  useEffect(() => {
    /**
     * Alert if clicked on outside of element
     */
    function handleClickOutside(event: MouseEvent) {
      if (event.target && ref.current && !ref.current.contains(event.target as any)) {
        cb(event);
      }
    }
    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref]);
}
