import { Definable, getToken } from "./definables";

interface ModeOptions {
  readonly turns: number;
  readonly name: string;
}

export class Mode extends Definable {
  private readonly _options: ModeOptions;
  public constructor(options: ModeOptions) {
    super(getToken());
    this._options = options;
  }

  public get name(): string {
    return this._options.name;
  }

  public get turns(): number {
    return this._options.turns;
  }
}
export const lifestealModeID: string = new Mode({
  name: "Lifesteal Mode",
  turns: 6,
}).id;
export const normalModeID: string = new Mode({
  name: "Normal Mode",
  turns: 6,
}).id;
export const slipperyModeID: string = new Mode({
  name: "Slippery Mode",
  turns: 3,
}).id;
