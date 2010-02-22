function DefaultLogicTreeSettings() {
  this.nodeHeight = 2;
  this.nodeWidth = 1;
  this.sideLines = true;
  this.nodeNameRequired = true;
  this.nodeBoxHeight = 0.75;
}

function DefaultLogicTreeHelper () {
  this.settings = new DefaultLogicTreeSettings();
  this.isValid = (function (tree) {
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
  });

  this.calculateHeight = (function (tree) {
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
  });

  this.calculateWidth = (function (tree) {
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
  });

  this.calculateChildPosition = (function (tree) {
    if (tree.type == "Op") {  // node positions not required
      if (tree.value == "and") {
        tree.child[0].start_x = tree.start_x;
        tree.child[1].start_x = tree.start_x + tree.child[0].width + 1;

        tree.child[0].start_y = tree.start_y;
        tree.child[1].start_y = tree.start_y;
      } else {
        tree.child[0].start_x = tree.start_x + (tree.width - tree.child[0].width) / 2;
        tree.child[1].start_x = tree.start_x + (tree.width - tree.child[1].width) / 2;

        tree.child[0].start_y = tree.start_y - (tree.height / 2) + (tree.child[0].height / 2);
        tree.child[1].start_y = tree.start_y + (tree.height / 2) - (tree.child[1].height / 2);
      }

      this.calculateChildPosition(tree.child[0]);
      this.calculateChildPosition(tree.child[1]);
    }
  });

  this.draw = (function (tree, context) {
    if (tree.type == "Op") {
      if (tree.value == "and") {
        this.drawAnd(tree, context);
      } else {
        this.drawOr(tree, context);
      }
    } else {
      this.drawNode(tree, context);
    }
  });

  this.drawNode = (function (tree, context) {
    context.sStrokeRect(tree.start_x, tree.start_y - (this.settings.nodeBoxHeight / 2), tree.width, this.settings.nodeBoxHeight);
  });

  this.drawOr = (function (tree, context) {
    for (i in tree.child) {
      context.beginPath();
      context.sMoveTo(tree.start_x, tree.start_y);
      context.sLineTo(tree.start_x, tree.child[i].start_y);
      context.sLineTo(tree.child[i].start_x, tree.child[i].start_y);
      context.stroke();

      context.beginPath();
      context.sMoveTo(tree.child[i].start_x + tree.child[i].width, tree.child[i].start_y);
      context.sLineTo(tree.start_x + tree.width, tree.child[i].start_y);
      context.sLineTo(tree.start_x + tree.width, tree.start_y);
      context.stroke();

      this.draw(tree.child[i], context);
    }
  });

  this.drawAnd = (function (tree, context) {
    context.beginPath();
    context.sMoveTo(tree.child[1].start_x - 1, tree.child[1].start_y);
    context.sLineTo(tree.child[1].start_x, tree.child[1].start_y);
    context.stroke();

    this.draw(tree.child[0], context);
    this.draw(tree.child[1], context);
  });

  this.drawSideBars = (function (tree, context) {
    if (this.settings.sideLines === true) {
      context.beginPath();
      context.sMoveTo(0, tree.start_y);
      context.sLineTo(tree.start_x, tree.start_y);
      context.stroke();

      context.beginPath();
      context.sMoveTo(context.tiles_wide, tree.start_y);
      context.sLineTo(context.tiles_wide - 1, tree.start_y);
      context.stroke();
    }
  });
}

function LogicTree() {
  this.helper = new DefaultLogicTreeHelper();
  this.canvas = null;
  this.context = null;
  this.tree = null;
  this.canvas_width = 0;
  this.canvas_height = 0;
  this.tree_loaded = false;
  this.error_message = null;

  this.init = (function (a_tree, a_canvas) {
    this.tree_loaded = false;
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
    this.context.tiles_wide = this.helper.calculateWidth(this.tree) + (this.helper.settings.sideLines ? 2 : 0);
    this.context.tiles_high = this.helper.calculateHeight(this.tree);

    this.tree.start_x = this.helper.settings.sideLines ? 1 : 0;
    this.tree.start_y = this.tree.height / 2;
    this.helper.calculateChildPosition(this.tree);
    
    this.dodgyExtendContextToMakeItEasyForMe();

    this.tree_loaded = true;
    return true;
  });
  
  this.dodgyExtendContextToMakeItEasyForMe = (function () {
    this.context.sLineTo = function (x, y) {this.lineTo(x * this.tile_width, y * this.tile_height)}
    this.context.sMoveTo = function (x, y) {this.moveTo(x * this.tile_width, y * this.tile_height)}
    this.context.sStrokeRect = function (x, y, w, h) {this.strokeRect(x * this.tile_width, y * this.tile_height, w * this.tile_width, h * this.tile_height)}
  });

  this.draw = (function () {
    if (this.tree_loaded) {
      // canvas details
      this.canvas_height = this.canvas.clientHeight;
      this.canvas_width = this.canvas.clientWidth;

      // scale by tile width to get the correct dimensions
      this.context.save();

      // Dangerous: The next lines define a possibly dangerous hack
      this.context.tile_width = this.canvas_width / this.context.tiles_wide;
      this.context.tile_height = this.canvas_height / this.context.tiles_high;

      this.context.lineWidth = 1;

      // clear the screen
      this.context.clearRect(0, 0, this.context.tiles_wide, this.context.tiles_high);

      this.helper.drawSideBars(this.tree, this.context);
      this.helper.draw(this.tree, this.context);
      this.context.restore();
    } else {
      this.error_message = "draw: The tree has not been (or could not be) loaded so it cannot be drawn";
      return false;
    }

    return true;
  });
}