import { EntityPosition } from "pixel-pigeon";

export interface Move {
  endPosition: EntityPosition;
  startPosition: EntityPosition;
  time: number;
}
