import { Definable } from "definables";

interface ModeOptions {
  readonly color: string;
  readonly name: string;
  readonly sourceY: number;
  readonly turns: number;
}

export class Mode extends Definable {
  private readonly _options: ModeOptions;
  public constructor(options: ModeOptions) {
    super();
    this._options = options;
  }

  public get color(): string {
    return this._options.color;
  }

  public get name(): string {
    return this._options.name;
  }

  public get sourceY(): number {
    return this._options.sourceY;
  }

  public get turns(): number {
    return this._options.turns;
  }
}
export const lifestealModeID: string = new Mode({
  color: "#e03c28",
  name: "Lifesteal",
  sourceY: 48,
  turns: 6,
}).id;
export const normalModeID: string = new Mode({
  color: "#ffffff",
  name: "Normal",
  sourceY: 96,
  turns: 6,
}).id;
export const slipperyModeID: string = new Mode({
  color: "#5ba8ff",
  name: "Slippery",
  sourceY: 72,
  turns: 3,
}).id;
export const knockbackModeID: string = new Mode({
  color: "#f68f37",
  name: "Knockback",
  sourceY: 0,
  turns: 6,
}).id;
export const reverseModeID: string = new Mode({
  color: "#6a31ca",
  name: "Reverse",
  sourceY: 24,
  turns: 6,
}).id;
