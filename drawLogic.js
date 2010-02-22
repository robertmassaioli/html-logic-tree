LogicTreeSettings = {
  nodeHeight : 2,
  nodeWidth : 1,
  sideLines : true,
  nodeNameRequired : true
}

LogicTreeHelper = {
  settings : LogicTreeSettings,
  isValid : function (tree) {
    // TODO See if this function is nicer by starting with valid = false
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
  calculateHeight : function (tree) {
    if (tree.type == "Val") {
      tree.height = this.settings.nodeHeight; // default
    } else if (tree.value == "and") {
      tree.height = Math.max(this.calculateHeight(tree.children[0]), this.calculateHeight(tree.children[1]));
    } else if (tree.value == "or") {
      tree.height = this.calculateHeight(tree.children[0]) + this.calculateHeight(tree.children[1]);
    } else {
      tree.height = -1; // obviously an error
    }
    return tree.height;
  },
  calculateWidth : function (tree) {
    if (tree.type == "Val") {
      tree.width = this.settings.nodeWidth; // default
    } else if (tree.value == "and") {
      tree.width = this.calculateWidth(tree.children[0]) + this.calculateWidth(tree.children[1]) + 1; // The +1 is the bar for the and
    } else if (tree.value == "or") {
      tree.width = Math.max(this.calculateWidth(tree.children[0]), this.calculateWidth(tree.children[1])) + 2; // The +2 is for bars in the Or
    } else {
      tree.width = -1; // obviously an error
    }
    return tree.width;
  },
  drawNode : function (tree) {
  }
}

LogicTree = {
  helper : LogicTreeHelper,
  canvas : null,
  context : null,
  tree : null,
  canvas_width : 0,
  canvas_height : 0,
  tiles_wide : 0,
  tiles_high : 0,
  tree_loaded : false,
  error_message : null,

  init : function (a_tree, a_canvas) {
    tree_loaded = false;
    if (!a_tree) { 
      this.error_message = "init: Tree was null";
      return false;
    }
    
    if (!a_canvas) { 
      this.error_message = "init: Canvas was null";
      return false;
    }
    
    if(!a_canvas.getContext) {
      this.error_message = "init: canvas 'getContext' function not found. Maybe your browser does not support HTML5?";
      return false;
    }
    
    // error handling done, now create stuff
    this.tree = a_tree;
    this.canvas = a_canvas;

    this.context = this.canvas.getContext('2d');
    if(!this.helper.isValid(this.tree)) {
      this.error_message = "init: Tree given contained invalid syntax.";
      return false;
    }

    // canvas details
    this.canvas_height = this.canvas.clientHeight;
    this.canvas_width = this.canvas.clientWidth;

    // tile details
    this.tiles_wide = this.helper.calculateWidth(this.tree) + (this.helper.settings.sideLines ? 2 : 0);
    this.tiles_high = this.helper.calculateHeight(this.tree);

    this.tree_loaded = true;
    return true;
  }
}
