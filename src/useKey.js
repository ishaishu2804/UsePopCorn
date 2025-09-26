import { useEffect } from "react";

export function useKey(action, key) {
  useEffect(() => {
    function callback(e) {
      if (e.key.toLowerCase() === key.toLowerCase()) {
        action(e);
      }
    }
    document.addEventListener("keydown", callback);
    return () => document.removeEventListener("keydown", callback);
  }, [action, key]);
}

