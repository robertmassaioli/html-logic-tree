function LogicTreeSettings() {
  this.canvasHeight = "300";
  this.canvasWidth = "600";
  this.nodeHeight = 2;
  this.nodeWidth = 1;
  this.sideLines = true;
  this.nodeNameRequired = true;
  this.nodeBoxHeight = 0.75;

  this.trueColor = "#00FF00";   // green
  this.falseColor = "#FF0000";  // red
  this.maybeColor = "#FFFF00";  // yellow

  // font settings
  this.font = new Object();
  this.font.weight = "bold";
  this.font.size = 30;
  this.font.style = "sans-serif";

  // font color
  this.font.defaultColor = null; // if this is set then the others are ignored
  this.font.trueColor = "black";
  this.font.falseColor = "black";
  this.font.maybeColor = "black";
  this.font.trueToMaybeColor = "grey";
  this.font.trueToFalseColor = "violet";
  this.font.maybeToFalseColor = "blue";

  this.font.chooseColor = (function (from, to) {
    if (this.defaultColor != null) return this.defaultColor;

    if (from === to) { // simple color
      switch(from) {
        case 'true':
          return this.trueColor;
        case 'false':
          return this.falseColor;
        case 'maybe':
          return this.maybeColor;
      }
    } else {
      if(from == 'true') {
        if (to == 'maybe') {
          return this.trueToMaybeColor;
        } else {
          return this.trueToFalseColor;
        }
      } else {
        return this.maybeToFalseColor;
      }
    }

    return this.defaultColor;
  });

  this.pickColor = (function (result) {
      if (result == "true") {
        return this.trueColor;
      } else if (result == "false") {
        return this.falseColor;
      }

      return this.maybeColor;
  });
}

function OLDHTML_LogicTreeSettings() {
  this.nodeBackgroundColor = '#EEEEEE';
}
OLDHTML_LogicTreeSettings.prototype = new LogicTreeSettings();

function LogicTreeHelper () {
  this.settings = null; // this object is not defined by default
  this.isValid = (function (tree) {
    var valid = true;

    if (!tree.type) return false;

    if (tree.type == "Val") {
      // if (this.settings.nodeNameRequired && (!tree.name || tree.name == "")) valid = false; - Now Allowed
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

  this.calculateBooleanResult = (function (tree) {
      if (tree.type == "Op") {
        var b0, b1;

        // setup the inputs
        if (tree.value == "and") {
          tree.child[0].parentIn = tree.parentIn;
          b0 = this.calculateBooleanResult(tree.child[0]);
          tree.child[1].parentIn = tree.child[0].out;
        } else {
          tree.child[0].parentIn = tree.parentIn;
          tree.child[1].parentIn = tree.parentIn;

          b0 = this.calculateBooleanResult(tree.child[0]);
        }

        // evaluate the right child node
        b1 = this.calculateBooleanResult(tree.child[1]);

        // Calculate the result
        var result;
        if (tree.value == "and") {
          result = this.complicatedAnd(b0, b1);
        } else {
          result = this.complicatedOr(b0, b1);
        }

        // set the results
        tree.out = result;
        return result;
      }

      // Otherwise just return the node value
      tree.out = this.complicatedAnd(tree.parentIn, tree.value);
      return tree.value;
  });

  this.complicatedAnd = (function (b1, b2) {
      if (b1 == "false" || b2 == "false") {
        return "false";
      } else if (b1 == "maybe" || b2 == "maybe") {
        return "maybe";
      }

      // no falses or maybe's so all that is left is true's
      return "true";
  });

  this.complicatedOr = (function (b1, b2) {
      if (b1 == "true" || b2 == "true") {
        return "true";
      } else if (b1 == "maybe" || b2 == "maybe") {
        return "maybe";
      }

      return "false";
  });

  // Abstract objects and functions
  this.canvas = null;
  this.initCanvas = null;
  this.prepareCanvas = null;
  this.draw = null;
  this.finishCanvas = null;
}

function OLDHTML_LogicTreeHelper() {
  this.tileSpace = null;
  this.context = new Object();
  
  this.initCanvas = (function (tree) {
    this.canvas = document.createElement('table');
    this.canvas.style.borderCollapse = "collapse";
    this.canvas.width = this.settings.canvasWidth;
    //this.canvas.height = this.settings.canvasHeight;

    // tile details
    this.context.tiles_wide = this.calculateWidth(tree) + (this.settings.sideLines ? 2 : 0);
    this.context.tiles_high = this.calculateHeight(tree);

    this.context.tile_width = this.canvas.width / this.context.tiles_wide;
    this.context.tile_height = this.settings.canvasHeight / this.context.tiles_high;

    tree.start_x = this.settings.sideLines ? 1 : 0;
    tree.start_y = tree.height / 2;
    this.calculateChildPosition(tree);

    // calculate the result of the tree
    tree.parentIn = "true";  // by default
    tree.out = this.calculateBooleanResult(tree);
  });

  this.prepareCanvas = (function () {
    // clear out the table
    while (this.canvas.rows.length > 0) {
      this.canvas.deleteRow(0);
    }

    // create a tile space that I can use
    this.tileSpace = new Array();
    for (var i = 0; i < this.context.tiles_high; ++i) {
      this.tileSpace[i] = new Array();
      //var newRow = document.createElement('tr');
      for (var j = 0; j < this.context.tiles_wide; ++j) {
        var newCell = document.createElement('td');
        newCell.style.width = this.context.tile_width;
        newCell.style.height = this.context.tile_height;
        this.tileSpace[i][j] = newCell;
        //newRow.appendChild(newCell);
      }
      //this.canvas.appendChild(newRow);
    }
  });

  this.finishCanvas = (function () {
    for (var i = 0; i < this.context.tiles_high; ++i) {
      var newRow = document.createElement('tr');
      for (var j = 0; j < this.context.tiles_wide; ++j) {
        if (this.tileSpace[i][j] != null) {
          newRow.appendChild(this.tileSpace[i][j]);
        }
      }
      this.canvas.appendChild(newRow);
    }
  });
  
  this.draw = (function (tree) {
    if (tree.type == "Op") {
      if (tree.value == "and") {
        this.drawAnd(tree);
      } else {
        this.drawOr(tree);
      }
    } else {
      this.drawNode(tree);
    }
  });

  this.drawNode = (function (tree) {
    this.tileSpace[tree.start_y][tree.start_x] = null; // delete the square below to make room
    var currentCell = this.tileSpace[tree.start_y - 1][tree.start_x];
    currentCell.rowSpan = '2';
    currentCell.style.verticalAlign = 'middle';
    var nodeDiv = document.createElement('div');
    nodeDiv.style.borderStyle = 'solid';
    nodeDiv.style.borderWidth = '1px';
    nodeDiv.style.borderColor = this.settings.pickColor(tree.out);
    if (tree.name) nodeDiv.innerHTML = tree.name;

    if (this.settings.nodeBackgroundColor) {
      nodeDiv.style.backgroundColor = this.settings.nodeBackgroundColor;
    } else {
      nodeDiv.style.backgroundColor = '#EEEEEE';
    }
    nodeDiv.style.color = this.settings.font.chooseColor(tree.parentIn, tree.out);
    nodeDiv.style.fontWeight = this.settings.font.weight;
    var maxHeight = Math.min(this.settings.nodeBoxHeight, this.settings.nodeHeight) * this.context.tile_height - 1;
    var fSize = Math.min(maxHeight, this.settings.font.size);
    nodeDiv.style.fontSize = fSize + 'px';

    var height = (this.settings.nodeBoxHeight * this.context.tile_height);
    nodeDiv.style.height = fSize + 'px';

    nodeDiv.style.textAlign = 'center';
    currentCell.valign = 'middle';
    currentCell.style.verticalAlign = 'middle';
    nodeDiv.style.verticalAlign = 'middle';
    nodeDiv.style.paddingTop = ((maxHeight - fSize) / 2) + 'px';
    nodeDiv.style.paddingBottom = ((maxHeight - fSize) / 2) + 'px';

    currentCell.appendChild(nodeDiv);
  });

  // the side variable => [0 - top, 1 - right, 2 - bottom, 3 - left]
  this.drawNodeLine = (function (offset, one, two, side, color) {
    var start = Math.min(one, two);
    var end = Math.max(one, two);

    var setupSide = (function (element) {
      element.style.borderColor = color;
      element.style.borderWidth = "1px";
      switch(side) {
        case 0:
          element.style.borderTopStyle = 'solid';
          break;
        case 1:
          element.style.borderRightStyle = 'solid';
          break;
        case 2:
          element.style.borderBottomStyle = 'solid';
          break;
        case 3:
          element.style.borderLeftStyle = 'solid';
          break;
        default:
          element.innerHTML = "<abbr title=\"Invalid Side Specified\">ISS</abbr>";
          break;
      }
    });

    var isVertical = (side % 2 != 0);
    for (var i = start; i < end; i++) {
      var currentCell = this.tileSpace[isVertical ? i : offset][isVertical ? offset : i];
      setupSide(currentCell);
    }
  });

  this.drawOr = (function (tree) {
    // top left
    this.drawNodeLine(tree.start_x, tree.start_y, tree.child[0].start_y, 3, this.settings.pickColor(tree.parentIn));
    this.drawNodeLine(tree.child[0].start_y, tree.start_x, tree.child[0].start_x, 0, this.settings.pickColor(tree.parentIn));

    // top right
    this.drawNodeLine(tree.child[0].start_y, tree.child[0].start_x + tree.child[0].width, tree.start_x + tree.width, 0, this.settings.pickColor(tree.child[0].out));
    this.drawNodeLine(tree.start_x + tree.width - 1, tree.child[0].start_y, tree.start_y, 1, this.settings.pickColor(tree.child[0].out));

    // bottom right
    this.drawNodeLine(tree.start_x + tree.width - 1, tree.start_y, tree.child[1].start_y, 1, this.settings.pickColor(tree.child[1].out));
    this.drawNodeLine(tree.child[1].start_y - 1, tree.child[1].start_x + tree.child[1].width, tree.start_x + tree.width, 2, this.settings.pickColor(tree.child[1].out));

    // bottom left
    this.drawNodeLine(tree.start_x, tree.start_y, tree.child[1].start_y, 3, this.settings.pickColor(tree.parentIn));
    this.drawNodeLine(tree.child[1].start_y - 1, tree.start_x, tree.child[1].start_x, 2, this.settings.pickColor(tree.parentIn));

    this.draw(tree.child[0]);
    this.draw(tree.child[1]);
  });

  this.drawAnd = (function (tree) {
    var currentCell = this.tileSpace[tree.child[1].start_y][tree.child[1].start_x - 1];
    currentCell.style.borderTopStyle = 'solid';
    currentCell.style.borderTopWidth = '1px';
    currentCell.style.borderTopColor = this.settings.pickColor(tree.child[0].out);

    this.draw(tree.child[0]);
    this.draw(tree.child[1]);
  });

  this.drawSideBars = (function (tree) {
    if (this.settings.sideLines === true) {
      var currentCell;

      currentCell = this.tileSpace[tree.start_y][0];
      currentCell.style.borderTopStyle = 'solid';
      currentCell.style.borderTopWidth = '1px';
      currentCell.style.borderTopColor = this.settings.pickColor(tree.parentIn);

      currentCell = this.tileSpace[tree.start_y][this.context.tiles_wide - 1];
      currentCell.style.borderTopStyle = 'solid';
      currentCell.style.borderTopWidth = '1px';
      currentCell.style.borderTopColor = this.settings.pickColor(tree.out);
    }
  });
}
OLDHTML_LogicTreeHelper.prototype = new LogicTreeHelper();  // inherit basic properties

function HTML5_LogicTreeHelper () {
  this.dodgyExtendContextToMakeItEasyForMe = (function (context) {
    context.sLineTo = function (x, y) {this.lineTo(x * this.tile_width, y * this.tile_height)}
    context.sMoveTo = function (x, y) {this.moveTo(x * this.tile_width, y * this.tile_height)}
    context.sStrokeRect = function (x, y, w, h) {this.strokeRect(x * this.tile_width, y * this.tile_height, w * this.tile_width, h * this.tile_height)}
    context.sFillRect = function (x, y, w, h) {this.fillRect(x * this.tile_width, y * this.tile_height, w * this.tile_width, h * this.tile_height)}
    context.sStrokeText = function (text, x, y, maxWidth) {this.strokeText(text, x * this.tile_width, y * this.tile_height, maxWidth)}
    context.sFillText = function (text, x, y, maxWidth, maxHeight) {
      var temp_font = this.font.split(" ");
      var fontSize = parseInt(temp_font[1]);
      if (fontSize > maxHeight * this.tile_height) {
        fontSize = (maxHeight * this.tile_height) - 1;
        temp_font[1] = fontSize + "px";
        this.font = temp_font.join(' ');
      }
      // this is currently not supported in Opera
      if (this.fillText) this.fillText(text, x * this.tile_width, y * this.tile_height + (fontSize / 3), maxWidth * this.tile_width);
    }
  });

  this.draw = (function (tree) {
    if (tree.type == "Op") {
      if (tree.value == "and") {
        this.drawAnd(tree);
      } else {
        this.drawOr(tree);
      }
    } else {
      this.drawNode(tree);
    }
  });

  this.drawNode = (function (tree) {
    this.context.strokeStyle = "#000000";
    var maxNodeHeight = Math.min(this.settings.nodeBoxHeight, this.settings.nodeHeight);
    var my_gradient = this.context.createLinearGradient(0, 0, this.context.canvas.width, 0);

    // small hack
    my_gradient.sAddColorStop = function (amount, color, context) {this.addColorStop((amount * context.tile_width) / context.canvas.width, color)}

    my_gradient.addColorStop(0.0, this.settings.pickColor(tree.parentIn));
    my_gradient.sAddColorStop(tree.start_x, this.settings.pickColor(tree.parentIn), this.context);
    my_gradient.sAddColorStop(tree.start_x + tree.width, this.settings.pickColor(tree.out), this.context);
    my_gradient.addColorStop(1.0, this.settings.pickColor(tree.out));

    this.context.fillStyle = my_gradient;
    this.context.sFillRect(tree.start_x, tree.start_y - (maxNodeHeight / 2), tree.width, maxNodeHeight);
    this.context.sStrokeRect(tree.start_x, tree.start_y - (maxNodeHeight / 2), tree.width, maxNodeHeight);

    this.context.fillStyle = this.settings.font.chooseColor(tree.parentIn, tree.out);
    if(tree.name) {
      this.context.sFillText(tree.name, tree.start_x + (tree.width / 2), tree.start_y, tree.width - 0.01, maxNodeHeight);
    }
  });

  this.drawOr = (function (tree) {
    for (i in tree.child) {
      this.context.strokeStyle = this.settings.pickColor(tree.parentIn);
      this.context.beginPath();
      this.context.sMoveTo(tree.start_x, tree.start_y);
      this.context.sLineTo(tree.start_x, tree.child[i].start_y);
      this.context.sLineTo(tree.child[i].start_x, tree.child[i].start_y);
      this.context.stroke();

      this.context.strokeStyle = this.settings.pickColor(tree.child[i].out);
      this.context.beginPath();
      this.context.sMoveTo(tree.child[i].start_x + tree.child[i].width, tree.child[i].start_y);
      this.context.sLineTo(tree.start_x + tree.width, tree.child[i].start_y);
      this.context.sLineTo(tree.start_x + tree.width, tree.start_y);
      this.context.stroke();

      this.draw(tree.child[i]);
    }
  });

  this.drawAnd = (function (tree) {
    this.context.strokeStyle = this.settings.pickColor(tree.child[0].out);
    this.context.beginPath();
    this.context.sMoveTo(tree.child[1].start_x - 1, tree.child[1].start_y);
    this.context.sLineTo(tree.child[1].start_x, tree.child[1].start_y);
    this.context.stroke();

    this.draw(tree.child[0]);
    this.draw(tree.child[1]);
  });

  this.drawSideBars = (function (tree) {
    if (this.settings.sideLines === true) {
      this.context.strokeStyle = this.settings.pickColor(tree.parentIn);
      this.context.beginPath();
      this.context.sMoveTo(0, tree.start_y);
      this.context.sLineTo(tree.start_x, tree.start_y);
      this.context.stroke();

      this.context.strokeStyle = this.settings.pickColor(tree.out);
      this.context.beginPath();
      this.context.sMoveTo(this.context.tiles_wide, tree.start_y);
      this.context.sLineTo(this.context.tiles_wide - 1, tree.start_y);
      this.context.stroke();
    }
  });

  this.initCanvas = (function (tree) {
    this.canvas.width = this.settings.canvasWidth;
    this.canvas.height = this.settings.canvasHeight;

    // tile details
    this.context.tiles_wide = this.calculateWidth(tree) + (this.settings.sideLines ? 2 : 0);
    this.context.tiles_high = this.calculateHeight(tree);

    this.context.tile_width = this.canvas.width / this.context.tiles_wide;
    this.context.tile_height = this.canvas.height / this.context.tiles_high;

    tree.start_x = this.settings.sideLines ? 1 : 0;
    tree.start_y = tree.height / 2;
    this.calculateChildPosition(tree);

    // calculate the result of the tree
    tree.parentIn = "true";  // by default
    tree.out = this.calculateBooleanResult(tree);
  });

  this.prepareCanvas = (function () {
    this.context.lineWidth = 1;

    // clear the screen
    this.context.clearRect(0, 0, this.context.tiles_wide, this.context.tiles_high);
    this.context.textAlign = "center";
    this.context.font = this.settings.font.weight + ' ' + this.settings.font.size + 'px ' + this.settings.font.style;
  });

  this.finishCanvas = (function () {
      // empty function because HTML5 is awesome! :D
  });

  this.canvas = document.createElement('canvas');
  this.context = this.canvas.getContext('2d');
  this.dodgyExtendContextToMakeItEasyForMe(this.context);
}
HTML5_LogicTreeHelper.prototype = new LogicTreeHelper();  // inherit basic properties

function LogicTree(forceOldHTML, settings, helper) {
  this.wrapper = null;
  this.tree = null;
  this.tree_loaded = false;
  this.error_message = null;

  this.setDimensions = (function (width, height) {
    if (this.helper && this.helper.settings) {
      this.helper.settings.canvasWidth = width;
      this.helper.settings.canvasHeight = height;
    }
  });

  this.init = (function (a_tree, a_wrapper) {
    this.tree_loaded = false;
    if (!a_tree) { 
      this.error_message = "init: Tree was null";
      return false;
    }
    
    if (!a_wrapper) { 
      this.error_message = "init: Wrapper was null";
      return false;
    }
    
    // error handling done, now create stuff
    this.tree = a_tree;
    this.wrapper = document.getElementById(a_wrapper);

    if(!this.helper.isValid(this.tree)) {
      this.error_message = "init: Tree given contained invalid syntax.";
      return false;
    }

    this.helper.initCanvas(this.tree);
    
    this.tree_loaded = true;
    return true;
  });
  
  this.draw = (function () {
    if (this.tree_loaded) {
      this.helper.prepareCanvas();
      this.wrapper.appendChild(this.helper.canvas);
      this.helper.drawSideBars(this.tree);
      this.helper.draw(this.tree);
      this.helper.finishCanvas();
    } else {
      this.error_message = "draw: The tree has not been (or could not be) loaded so it cannot be drawn";
      return false;
    }

    return true;
  });

  // Begin External Code
  // This canvas function was copied (With Permission) from http://code.google.com/p/browser-canvas-support/
  this.canvas_compatible = false;
  this.check_canvas = (function() {
      try {
        this.canvas_compatible = !!(document.createElement('canvas').getContext('2d')); // S60
        } catch(e) {
        this.canvas_compatible = !!(document.createElement('canvas').getContext); // IE
      } 
      return this.canvas_compatible;
  });
  // End External Code 

  // run the check once
  this.check_canvas();

  if (helper) {
    this.helper = helper;
  } else {
    if (this.canvas_compatible && !forceOldHTML) {
      this.helper = new HTML5_LogicTreeHelper();
    } else {
      this.helper = new OLDHTML_LogicTreeHelper();
    }
  }

  if (settings) {
    this.helper.settings = settings;
  } else {
    if (this.canvas_compatible && !forceOldHTML) {
      this.helper.settings = new LogicTreeSettings();
    } else {
      this.helper.settings = new OLDHTML_LogicTreeSettings();
    }
  }
}
