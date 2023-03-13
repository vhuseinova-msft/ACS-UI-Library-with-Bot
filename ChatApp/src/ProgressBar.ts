import * as Adaptive from "adaptivecards";

class ProgressBarBase extends Adaptive.CardElement{
  protected internalRender(): HTMLElement | undefined {
    throw new Error("Method not implemented.");
  }

  getJsonTypeName(): string {
    throw new Error("Method not implemented.");
  }


  public static readonly titleProperty = new Adaptive.StringProperty(
    Adaptive.Versions.v1_0,
    "title",
    true
  );

  public static readonly valueProperty = new Adaptive.NumProperty(
    Adaptive.Versions.v1_0,
    "value",
    0
  );
}

 class ProgressBar extends ProgressBarBase {
  public static readonly JsonTypeName = "ProgressBar";

  //#region Schema
  // moved to the parent class
  // public static readonly titleProperty = new Adaptive.StringProperty(
  //   Adaptive.Versions.v1_0,
  //   "title",
  //   true
  // );
  // public static readonly valueProperty = new Adaptive.NumProperty(
  //   Adaptive.Versions.v1_0,
  //   "value",
  //   0
  // );

  @Adaptive.property(ProgressBarBase.titleProperty)
  get title(): string | undefined {
    return this.getValue(ProgressBar.titleProperty);
  }

  set title(value: string | undefined) {
    if (this.title !== value) {
      this.setValue(ProgressBar.titleProperty, value);

      this.updateLayout();
    }
  }

  // @Adaptive.property(ProgressBar.valueProperty)
   @Adaptive.property(ProgressBarBase.valueProperty)
  get value(): number {
    return this.getValue(ProgressBar.valueProperty);
  }

  set value(value: number) {
    let adjustedValue = value;

    if (adjustedValue < 0) {
      adjustedValue = 0;
    } else if (adjustedValue > 100) {
      adjustedValue = 100;
    }

    if (this.value !== adjustedValue) {
      this.setValue(ProgressBar.valueProperty, adjustedValue);

      this.updateLayout();
    }
  }

  //#endregion

  private _titleElement?: HTMLElement;
  private _leftBarElement?: HTMLElement;
  private _rightBarElement?: HTMLElement;

  protected internalRender(): HTMLElement | undefined {
    let element = document.createElement("div");

    let textBlock = new Adaptive.TextBlock();
    textBlock.setParent(this);
    textBlock.text = this.title;

    textBlock.wrap = true;

    this._titleElement = textBlock.render();

    if (this._titleElement) {
      this._titleElement.style.marginBottom = "6px";

      let progressBarElement = document.createElement("div");
      progressBarElement.style.display = "flex";

      this._leftBarElement = document.createElement("div");
      this._leftBarElement.style.height = "6px";

      let emphasisForegroundAccentColor = Adaptive.stringToCssColor(
        this.hostConfig.containerStyles.emphasis.foregroundColors.accent.default
      );

      if (emphasisForegroundAccentColor) {
        this._leftBarElement.style.backgroundColor =
          emphasisForegroundAccentColor;
      }

      this._rightBarElement = document.createElement("div");
      this._rightBarElement.style.height = "6px";

      let emphasisBackgroundColor = Adaptive.stringToCssColor(
        this.hostConfig.containerStyles.emphasis.backgroundColor
      );

      if (emphasisBackgroundColor) {
        this._rightBarElement.style.backgroundColor = emphasisBackgroundColor;
      }

      progressBarElement.append(this._leftBarElement, this._rightBarElement);

      element.append(this._titleElement, progressBarElement);

      return element;
    }

    return undefined;
  }

  getJsonTypeName(): string {
    return ProgressBar.JsonTypeName;
  }

  updateLayout(processChildren: boolean = true) {
    super.updateLayout(processChildren);

    if (this.renderedElement) {
      if (this._titleElement) {
        if (this.title) {
          this._titleElement.style.display = "none";
        } else {
          this._titleElement.style.removeProperty("display");
        }
      }
      if (this._leftBarElement) {
        this._leftBarElement.style.flex = "1 1 " + this.value + "%";
      }
      if (this._rightBarElement) {
        this._rightBarElement.style.flex = "1 1 " + (100 - this.value) + "%";
      }
    }
  }
}

export default ProgressBar; 
