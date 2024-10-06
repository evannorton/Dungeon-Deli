import { Character } from "../characters";
import { beginTurn } from "./beginTurn";
import { getDefinable } from "definables";
import { state } from "../state";

export const attemptPlayerPass = (): void => {
  if (state.values.playerCharacterID === null) {
    throw new Error("Attempted to move player with no player character ID.");
  }
  if (state.values.turnPart === null) {
    const playerCharacter: Character = getDefinable(
      Character,
      state.values.playerCharacterID,
    );
    if (playerCharacter.isAlive()) {
      beginTurn();
    }
  }
};
