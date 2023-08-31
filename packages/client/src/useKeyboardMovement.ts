import { useEffect, useState } from "react";
import { useMUD } from "./MUDContext";
import { ErrorWithShortMessage } from "./CustomTypes";

export const useKeyboardMovement = () => {
  const {
    systemCalls: { moveBy },
  } = useMUD();

  const [moveMessage, setMoveMessage] = useState<string>("");

  const clearMoveMessage = () => {
    setMoveMessage("");
  };

  useEffect(() => {
    const listener = async (e: KeyboardEvent) => {
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
      } catch (error) {
        console.log("catch block triggerd. Error: ", error);
        if (typeof error === "object" && error !== null) {
          const message = (error as ErrorWithShortMessage).shortMessage;
          setMoveMessage(message);
        } else {
          console.error(error);
        }
      }
    };

    window.addEventListener("keydown", listener);
    return () => window.removeEventListener("keydown", listener);
  }, [moveBy]);

  return { moveMessage, clearMoveMessage };
};
