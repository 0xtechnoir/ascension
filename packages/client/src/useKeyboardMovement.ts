import { useEffect, useState } from "react";
import { useMUD } from "./MUDContext";
import { parseError } from "./utils";

export const useKeyboardMovement = () => {
  const {
    systemCalls: { moveBy },
  } = useMUD();

  const [moveMessage, setMoveMessage] = useState<string | null>(null);

  useEffect(() => {
    const listener = async (e: KeyboardEvent) => {
      let message;
      try {
        if (e.key === "ArrowUp") {
          await moveBy(0, -1);
        }
        if (e.key === "ArrowDown") {
          await moveBy(0, 1);
        }
        if (e.key === "ArrowLeft") {
          await moveBy(-1, 0);
        }
        if (e.key === "ArrowRight") {
          await moveBy(1, 0);
        }
      } 
      catch (error: any) {
        setMoveMessage(parseError(error));
      }
    };

    window.addEventListener("keydown", listener);
    return () => window.removeEventListener("keydown", listener);
  }, [moveBy]);

  return moveMessage;
};
