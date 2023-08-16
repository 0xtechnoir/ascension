import { ReactNode, useEffect, useState } from "react";
import { useComponentValue } from "@latticexyz/react";
import { Entity } from "@latticexyz/recs";
import { twMerge } from "tailwind-merge";
import { useMUD } from "./MUDContext";

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
    entity: Entity;
  }[];
  encounter?: ReactNode;
};

export const GameMap = ({
  width,
  height,
  onTileClick,
  terrain,
  players,
  encounter,
}: Props) => {
  const {
    network: { playerEntity },
    components: { Range },
  } = useMUD();

  const [hoveredTile, setHoveredTile] = useState({ x: -1, y: -1 });
  const rows = new Array(width).fill(0).map((_, i) => i);
  const columns = new Array(height).fill(0).map((_, i) => i);
  const shipRange = useComponentValue(Range, playerEntity)?.value;
  let playerPosition = players?.find((p) => p.entity === playerEntity);
  const [showEncounter, setShowEncounter] = useState(false);
  
  // Reset show encounter when we leave encounter
  useEffect(() => {
    if (!encounter) {
      setShowEncounter(false);
    }
  }, [encounter]);

  return (
    <div className="inline-grid p-2 bg-slate-900 relative overflow-hidden">
      {rows.map((y) =>
        columns.map((x) => {
          const terrainEmoji = terrain?.find(
            (t) => t.x === x && t.y === y
          )?.emoji;

          const playersHere = players?.filter((p) => p.x === x && p.y === y);
          const mainPlayerHere = playersHere?.find(
            (p) => p.entity === playerEntity
          );

          // Define the ships firing perimeter
          let isAdjacentToPlayer = (
            playerPosition && shipRange && (
              (Math.abs(playerPosition.x - x) <= shipRange && Math.abs(playerPosition.y - y) <= shipRange)
              && !(playerPosition.x === x && playerPosition.y === y)
            )
          );
          const isHovered = hoveredTile.x === x && hoveredTile.y === y; // Check if the current tile is hovered

          return (
            <div
              key={`${x},${y}`}
              className={twMerge(
                "w-8 h-8 flex items-center justify-center border border-gray-500",
                onTileClick ? "cursor-pointer hover:ring" : null,
                isAdjacentToPlayer ? "bg-slate-600" : null,
                isHovered ? "bg-blue-500" : null // Add styling for hovered tile
              )}
              style={{
                gridColumn: x + 1,
                gridRow: y + 1,
              }}
              onClick={() => {
                onTileClick?.(x, y);
              }}
              onMouseEnter={() => setHoveredTile({ x, y })} // Set the hovered tile when mouse enters
              onMouseLeave={() => setHoveredTile({ x: -1, y: -1 })} // Reset the hovered tile when mouse leave
            >
              {encounter && mainPlayerHere ? (
                <div
                  className="absolute z-10 animate-battle"
                  style={{
                    boxShadow: "0 0 0 100vmax black",
                  }}
                  onAnimationEnd={() => {
                    setShowEncounter(true);
                  }}
                ></div>
              ) : null}
              <div className="flex flex-wrap gap-1 items-center justify-center relative">
                {terrainEmoji ? (
                  <div className="absolute inset-0 flex items-center justify-center text-3xl pointer-events-none">
                    {terrainEmoji}
                  </div>
                ) : null}
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

      {encounter && showEncounter ? (
        <div
          className="relative z-10 -m-2 bg-black text-white flex items-center justify-center"
          style={{
            gridColumnStart: 1,
            gridColumnEnd: width + 1,
            gridRowStart: 1,
            gridRowEnd: height + 1,
          }}
        >
          {encounter}
        </div>
      ) : null}
    </div>
  );
};
