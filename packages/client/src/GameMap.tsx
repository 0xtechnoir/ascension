import { useState } from "react";
import { useComponentValue } from "@latticexyz/react";
import { Entity, getComponentValueStrict } from "@latticexyz/recs";
import { twMerge } from "tailwind-merge";
import { useMUD } from "./MUDContext";

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
  highlightedPlayer: Entity | null;
};

export const GameMap = ({
  width,
  height,
  onTileClick,
  players,
  highlightedPlayer,
}: Props) => {
  const {
    network: { playerEntity },
    components: { Range, Position },
  } = useMUD();

  let highlightedPlayerPosition: Position | null = null;
  if (highlightedPlayer) {
    highlightedPlayerPosition = getComponentValueStrict(
      Position,
      highlightedPlayer
    );
  }

  const [hoveredTile, setHoveredTile] = useState({ x: -1, y: -1 });
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
          const playersHere = players?.filter((p) => p.x === x && p.y === y);

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

          const isHovered = hoveredTile.x === x && hoveredTile.y === y; // Check if the current tile is hovered

          return (
            <div
              key={`${x},${y}`}
              className={twMerge(
                "w-12 h-12 flex items-center justify-center border border-gray-500",
                onTileClick ? "cursor-pointer hover:ring" : null,
                isAdjacentToPlayer ? "bg-slate-600" : null,
                isHovered ? "bg-blue-500" : null, // Add styling for hovered tile
                isHighlighted ? "bg-gray-300" : null
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

  // return (
  //   <div className="grid">
  //     {/* Horizontal numbers (Column numbers) */}
  //     <div className="grid-row">
  //       {Array.from({ length: width }).map((_, columnIndex) => (
  //         <div key={columnIndex} className="grid-cell">
  //           {columnIndex + 1}
  //         </div>
  //       ))}
  //     </div>
  //     {/* Actual game map grid */}
  //     {Array.from({ length: height }).map((_, rowIndex) => (
  //       <div key={rowIndex} className="grid-row">
  //         {/* Vertical number (Row number) */}
  //         <div className="grid-cell">{rowIndex + 1}</div>
  //         {/* Tiles for this row */}
  //         {Array.from({ length: width }).map((_, columnIndex) => (
  //           <div
  //             key={columnIndex}
  //             className="grid-cell"
  //             onClick={() => onTileClick && onTileClick(columnIndex, rowIndex)}
  //           >
  //             {/* Your existing tile rendering logic here */}
  //           </div>
  //         ))}
  //       </div>
  //     ))}
  //   </div>
  // );
};

