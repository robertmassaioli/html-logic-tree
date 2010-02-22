LogicTreeSettings = {
  nodeHeight : 2,
  nodeWidth : 1,
  extraWidth : 2,
  nodeNameRequired : true
}

LogicTree = {
  settings : LogicTreeSettings,
  isValid : function (tree) {
    var valid = true;

    if (!tree.type) return false;

    if (tree.type == "Val") {
      if (this.settings.nodeNameRequired && (!tree.name || tree.name == "")) valid = false;
      if (tree.value) {
        switch(tree.value) {
          case 'true':
          case 'false':
          case 'maybe':
            break;
          default:
            valid = false;
        }
      } else {
        valid = false;
      }
    } else if (tree.type == "Op") {
      if (tree.value) {
        switch(tree.value) {
          case 'and':
          case 'or':
            if (!tree.children[0]) return false;
            if (!tree.children[1]) return false;
            valid = valid && this.isValid(tree.children[0]) && this.isValid(tree.children[1]);
            break;
          default:
            valid = false;
        }
      } else {
        valid = false;
      }
    } else {
      valid = false;
    }

    return valid;
  },
  getHeight : function (tree) {
    if (tree.type == "Val") {
      return this.settings.nodeHeight; // default
    } else if (tree.value == "and") {
      return Math.max(this.getHeight(tree.children[0]), this.getHeight(tree.children[1]));
    } else if (tree.value == "or") {
      return this.getHeight(tree.children[0]) + this.getHeight(tree.children[1]);
    }
    return -100;  // TODO the isValid function should prevent this from happening
  },
  getWidth : function (tree) {
    if (tree.type == "Val") {
      return this.settings.nodeWidth; // default
    } else if (tree.value == "and") {
      return this.getWidth(tree.children[0]) + this.getWidth(tree.children[1]) + 1; // The +1 is the bar for the and
    } else if (tree.value == "or") {
      return Math.max(this.getWidth(tree.children[0]), this.getWidth(tree.children[1])) + 2; // The +2 is for bars in the Or
    }
    return -100;  // TODO the isValid function should prevent this from happening
  }
}

function drawLogic (logic) {

}
