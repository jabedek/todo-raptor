import { useEffect } from "react";
import { CallbackFn } from "frotsi";

/**
 * Hook that alerts clicks outside of the passed ref
 */
export function useHandleOutclick<T extends HTMLElement>(ref: React.RefObject<T>, cb: CallbackFn): void {
  useEffect(() => {
    /**
     * Alert if clicked on outside of element
     */
    function handleOutclick(event: MouseEvent): void {
      if (event.target && ref.current && !ref.current.contains(event.target as Node | null)) {
        cb(event);
      }
    }
    // Bind the event listener
    document.addEventListener("mousedown", handleOutclick);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("mousedown", handleOutclick);
    };
  }, [ref]);
}
