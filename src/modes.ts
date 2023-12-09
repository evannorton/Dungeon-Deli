import { Definable } from "./definables";

interface ModeOptions {
  readonly name: string;
}

export class Mode extends Definable {
  private readonly _options: ModeOptions;
  public constructor(id: string, options: ModeOptions) {
    super(id);
    this._options = options;
  }

  public get name(): string {
    return this._options.name;
  }
}
new Mode("lifesteal", { name: "Lifesteal Mode" });
new Mode("normal", { name: "Normal Mode" });
