import { useComponentValue } from "@latticexyz/react";
import { Entity, getComponentValueStrict } from "@latticexyz/recs";
import { twMerge } from "tailwind-merge";
import { useMUD } from "./MUDContext";
import { useGameContext } from "./GameContext";

type Position = {
  x: number;
  y: number;
};

type Props = {
  width: number;
  height: number;
  onTileClick?: (x: number, y: number) => void;
  terrain?: {
    x: number;
    y: number;
    emoji: string;
  }[];
  players?: {
    x: number;
    y: number;
    emoji: string;
    entity: Entity | null;
  }[];
  onRightClickPlayer: (
    event: React.MouseEvent,
    playerEntity: Entity | null
  ) => void;
};

export const GameMap = ({
  width,
  height,
  onTileClick,
  players,
  onRightClickPlayer,
}: Props) => {
  const {
    network: { playerEntity },
    components: { Range, Position },
  } = useMUD();

  const { highlightedPlayer } = useGameContext();

  let highlightedPlayerPosition: Position | null = null;
  if (highlightedPlayer) {
    highlightedPlayerPosition = getComponentValueStrict(
      Position,
      highlightedPlayer
    );
  }

  const handlePlayerRightClick = (
    event: React.MouseEvent,
    playerEntity: Entity | null
  ) => {
    event.preventDefault();
    onRightClickPlayer(event, playerEntity);
  };

  const rows = new Array(width).fill(0).map((_, i) => i);
  const columns = new Array(height).fill(0).map((_, i) => i);
  const shipRange = useComponentValue(Range, playerEntity)?.value;
  let playerPosition = players?.find((p) => p.entity === playerEntity);

  return (
    <div className="inline-grid p-2 bg-slate-900 relative overflow-hidden">
      {rows.map((y) =>
        columns.map((x) => {
          let isHighlighted: boolean | null = false;
          if (highlightedPlayerPosition) {
            isHighlighted =
              highlightedPlayer &&
              x === highlightedPlayerPosition.x &&
              y === highlightedPlayerPosition.y;
          }

          // Define the ships firing perimeter
          let totalDistance = 0;
          if (playerPosition && shipRange) {
            let deltaX = Math.abs(playerPosition.x - x);
            let deltaY = Math.abs(playerPosition.y - y);
            totalDistance = deltaX + deltaY;
          }
          let isAdjacentToPlayer =
            playerPosition &&
            shipRange &&
            totalDistance <= shipRange &&
            totalDistance !== 0;

          const playersHere = (players || []).filter(
            (p) => p.x === x && p.y === y
          );
          const hasPlayers = playersHere.length > 0;

          return (
            <div
              key={`${x},${y}`}
              className={twMerge(
                "w-12 h-12 flex items-center justify-center border border-gray-500",
                isAdjacentToPlayer ? "bg-slate-600" : null,
                isHighlighted ? "bg-gray-300" : null
              )}
              style={{
                gridColumn: x + 1,
                gridRow: y + 1,
              }}
              onClick={() => {
                onTileClick?.(x, y);
              }}
              onContextMenu={
                hasPlayers
                  ? (event) =>
                      handlePlayerRightClick(event, playersHere[0].entity)
                  : undefined
              }
            >
              <div className="flex flex-wrap gap-1 items-center justify-center relative">
                <div className="relative">
                  {playersHere?.map((p) => (
                    <span key={p.entity}>{p.emoji}</span>
                  ))}
                </div>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};
