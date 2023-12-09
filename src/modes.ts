import { Definable, getToken } from "./definables";

interface ModeOptions {
  readonly duration: number;
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
}
export const lifestealModeID: string = new Mode({
  duration: 8,
  name: "Lifesteal Mode",
}).id;
export const normalModeID: string = new Mode({
  duration: 8,
  name: "Normal Mode",
}).id;
export const slipperyModeID: string = new Mode({
  duration: 4,
  name: "Slippery Mode",
}).id;
