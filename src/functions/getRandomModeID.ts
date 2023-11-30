import { Mode } from "../modes";
import { getDefinables } from "../definables";

export const getRandomModeID = (): string => {
  const modes: Map<string, Mode> = getDefinables(Mode);
  const index: number = Math.floor(Math.random() * modes.size);
  return Array.from(modes)[index][1].id;
};
