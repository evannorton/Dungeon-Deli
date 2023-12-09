import { Definable, getToken } from "./definables";

interface ModeOptions {
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
  name: "Lifesteal Mode",
}).id;
export const normalModeID: string = new Mode({ name: "Normal Mode" }).id;
export const slipperyModeID: string = new Mode({ name: "Slippery Mode" }).id;
