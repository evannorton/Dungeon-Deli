import { Definable, getToken } from "./definables";

interface ModeOptions {
  readonly color: string;
  readonly name: string;
  readonly turns: number;
}

export class Mode extends Definable {
  private readonly _options: ModeOptions;
  public constructor(options: ModeOptions) {
    super(getToken());
    this._options = options;
  }

  public get color(): string {
    return this._options.color;
  }

  public get name(): string {
    return this._options.name;
  }

  public get turns(): number {
    return this._options.turns;
  }
}
export const lifestealModeID: string = new Mode({
  color: "#e03c28",
  name: "Lifesteal Mode",
  turns: 6,
}).id;
export const normalModeID: string = new Mode({
  color: "#ffffff",
  name: "Normal Mode",
  turns: 6,
}).id;
export const slipperyModeID: string = new Mode({
  color: "#5ba8ff",
  name: "Slippery Mode",
  turns: 3,
}).id;
