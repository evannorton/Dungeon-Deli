import { Definable } from "./definables";

interface IngredientOptions {
  readonly imagePath: string;
}

export class Ingredient extends Definable {
  private readonly _options: IngredientOptions;
  public constructor(id: string, options: IngredientOptions) {
    super(id);
    this._options = options;
  }

  public get imagePath(): string {
    return this._options.imagePath;
  }
}
new Ingredient("bread", { imagePath: "ingredients/bread" });
new Ingredient("cheese", { imagePath: "ingredients/cheese" });
new Ingredient("lettuce", { imagePath: "ingredients/lettuce" });
new Ingredient("meat", { imagePath: "ingredients/meat" });
new Ingredient("tomato", { imagePath: "ingredients/tomato" });
