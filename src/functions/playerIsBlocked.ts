import { Character } from "../characters";
import { CollisionData, EntityPosition, getEntityPosition } from "pixel-pigeon";
import { getDefinable } from "../definables";
import { getRectangleCollisionData } from "pixel-pigeon/api/functions/getRectangleCollisionData";
import { state } from "../state";

export const playerIsBlocked = (): boolean => {
  if (state.values.playerCharacterID === null) {
    throw new Error(
      "Attempted to check if player can move with no player character ID.",
    );
  }
  const playerCharacter: Character = getDefinable(
    Character,
    state.values.playerCharacterID,
  );
  const playerPosition: EntityPosition = getEntityPosition(
    playerCharacter.entityID,
  );
  const possiblePositions: EntityPosition[] = [
    {
      x: playerPosition.x + 24,
      y: playerPosition.y,
    },
    {
      x: playerPosition.x - 24,
      y: playerPosition.y,
    },
    {
      x: playerPosition.x,
      y: playerPosition.y + 24,
    },
    {
      x: playerPosition.x,
      y: playerPosition.y - 24,
    },
  ];
  for (const position of possiblePositions) {
    const collisionData: CollisionData = getRectangleCollisionData(
      {
        height: 24,
        width: 24,
        x: position.x,
        y: position.y,
      },
      ["monster"],
    );
    if (
      collisionData.map === false &&
      collisionData.entityCollidables.length === 0
    ) {
      return false;
    }
  }
  return true;
};
