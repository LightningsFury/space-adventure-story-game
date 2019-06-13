class StoryEngine {
  constructor(originalContext, beforeChoice) {
    if (!originalContext || !beforeChoice)
      throw new Error("no context or choice function given");
    this.context = originalContext;
    this.beforeChoice = beforeChoice;
  }

  get currentContext() {
    const beginningObject = {
      description: this.context.description,
      options: this.options
    };
    const isThereAButton = {};
    if (this.context.value) isThereAButton.value = this.context.value;
    if (this.context.willJump) isThereAButton.willJump = true;
    return Object.assign(beginningObject, isThereAButton);
  }

  get options() {
    const arr = [];
    for (const i in this.context.options) {
      arr.push({
        onClick: this.createOption(i).bind(this),
        value: this.context.options[i].value,
        description: this.context.options[i].description
      });
    }
    return arr;
  }

  createOption(i) {
    return () => {
      this.beforeChoice(
        this.context.options[i].onClick ||
          this.setContext(i, this.context).bind(this),
        this.context.options[i].finished || false
      );
    };
  }

  setContext(i, context) {
    return () => {
      if (this.context.willJump) {
        this.context = this.previousContext;
      } else if (this.context.options[i].jump) {
        this.previousContext = this.context;
        this.context.options[i].willJump = true;
        this.context.options[i] = {
          ...this.context.options[i],
          options: [{ onClick: this.setContext(0, this.context), value: "OK" }]
        };
        this.context = this.context.options[i];
      } else this.context = this.context.options[i];
    };
  }
}

export default StoryEngine;
