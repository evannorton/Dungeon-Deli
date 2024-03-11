import { Character } from "../characters";
import { Chest } from "../chests";
import {
  CollisionData,
  EntityPosition,
  getEntityPosition,
  getRectangleCollisionData,
} from "pixel-pigeon";
import { getDefinable } from "../definables";
import { state } from "../state";

export const getPlayerChest = (): Chest | null => {
  if (state.values.playerCharacterID === null) {
    throw new Error(
      "Attempted to get player chest with no player character ID.",
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
    const collisionData: CollisionData = getRectangleCollisionData({
      entityTypes: ["chest"],
      rectangle: {
        height: 24,
        width: 24,
        x: position.x,
        y: position.y,
      },
    });
    if (collisionData.entityCollidables.length > 0) {
      return getDefinable(Chest, collisionData.entityCollidables[0].entityID);
    }
  }
  return null;
};
