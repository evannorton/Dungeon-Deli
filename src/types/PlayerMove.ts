import { EntityPosition } from "pixel-pigeon";

export interface PlayerMove {
  endPosition: EntityPosition;
  startPosition: EntityPosition;
  time: number;
}
