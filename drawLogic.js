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
            if (!tree.child[0]) return false;
            if (!tree.child[1]) return false;
            valid = valid && this.isValid(tree.child[0]) && this.isValid(tree.child[1]);
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
      tree.height = Math.max(this.calculateHeight(tree.child[0]), this.calculateHeight(tree.child[1]));
    } else if (tree.value == "or") {
      tree.height = this.calculateHeight(tree.child[0]) + this.calculateHeight(tree.child[1]);
    } else {
      tree.height = -1; // obviously an error
    }
    return tree.height;
  },
  calculateWidth : function (tree) {
    if (tree.type == "Val") {
      tree.width = this.settings.nodeWidth; // default
    } else if (tree.value == "and") {
      tree.width = this.calculateWidth(tree.child[0]) + this.calculateWidth(tree.child[1]) + 1; // The +1 is the bar for the and
    } else if (tree.value == "or") {
      tree.width = Math.max(this.calculateWidth(tree.child[0]), this.calculateWidth(tree.child[1])) + 2; // The +2 is for bars in the Or
    } else {
      tree.width = -1; // obviously an error
    }
    return tree.width;
  },
  calculateChildPosition : function (tree) {
    if (tree.type == "Op") {  // node positions not required
      if (tree.value == "and") {
        tree.child[0].start_x = tree.start_x;
        tree.child[1].start_x = tree.start_x + tree.child[0].width + 1;

        tree.child[0].start_y = tree.start_y;
        tree.child[1].start_y = tree.start_y;
      } else {
        tree.child[0].start_x = tree.start_x + 1;
        tree.child[1].start_x = tree.start_x + 1;

        tree.child[0].start_y = tree.start_y - (tree.height / 2) + (tree.child[0].height / 2);
        tree.child[1].start_y = tree.start_y + (tree.height / 2) - (tree.child[1].height / 2);
      }
    }
  },
  tile_width : null,
  tile_height : null,
  draw : function (tree) {
    if (tree.type == "Op") {
      if (tree.value == "and") {
        drawAnd(tree);
      } else {
        drawOr(tree);
      }
    } else {
      drawNode(tree);
    }
  },
  drawNode : function (tree, context) {
  },
  drawOr : function (tree, context) {
    context.begin_path();
    context.move_to(tree.start_x * tile_width, tree.start_y * tile_height);
    context.line_to(tree.child[0]
    context.end_path();

    
  },
  drawAnd : function (tree, context) {
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


    // tile details
    this.tiles_wide = this.helper.calculateWidth(this.tree) + (this.helper.settings.sideLines ? 2 : 0);
    this.tiles_high = this.helper.calculateHeight(this.tree);

    this.tree.start_x = this.helper.settings.sideLines ? 1 : 0;
    this.tree.start_y = this.tree.height / 2;
    this.helper.calculateChildPosition(this.tree);

    this.tree_loaded = true;
    return true;
  },
  draw : function () {
    if (tree_loaded) {
      // canvas details
      this.canvas_height = this.canvas.clientHeight;
      this.canvas_width = this.canvas.clientWidth;

      // set the helper tile widths
      this.helper.tile_width = this.canvas_width / tiles_wide;
      this.helper.tile_height = this.canvas_height / tiles_high;

      // clear the screen
      this.context.clearRect(0, 0, this.canvas_width, this.canvas_height)

      this.helper.draw(this.tree, this.context);
    } else {
      this.error_message = "draw: The tree has not been (or could not be) loaded so it cannot be drawn";
      return false;
    }

    return true;
  }
}
