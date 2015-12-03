module.exports = class Sketchpad {
  constructor(options={}) {
    this.canvas = options.canvas;
    this.context = this.canvas.getContext('2d');

    this.brush = {
      color: options.color || '#000',
      size: options.brushSize || 5,
    };

    // Enforce context on all hook methods
    ['onMouseDown', 'onMouseUp', 'onMouseMove',
     'onTouchDown', 'onTouchUp', 'onTouchMove'].forEach(function(method) {
      this[method] = this[method].bind(this);
    }, this);

    // Listen for mouse movements
    this.canvas.addEventListener('mousedown', this.onMouseDown);
    this.canvas.addEventListener('mouseout', this.onMouseUp);
    this.canvas.addEventListener('mouseup', this.onMouseUp);

    // Listen for touch events
    this.canvas.addEventListener('touchstart', this.onTouchStart);
    this.canvas.addEventListener('touchend', this.onTouchEnd);
    this.canvas.addEventListener('touchcancel', this.onTouchEnd);
    this.canvas.addEventListener('touchleave', this.onTouchEnd);
  }

  /*
   * Helper Functions
   */

  cursor(event) {
    return {
      x: event.pageX - this.canvas.offsetLeft,
      y: event.pageY - this.canvas.offsetTop,
    };
  }

  /*
   * Mouse Hooks
   */

  onMouseDown(event) {
    this._lastCursor = this.cursor(event);
    this.canvas.addEventListener('mousemove', this.onMouseMove);
  }

  onMouseUp(event) {
    this.canvas.removeEventListener('mousemove', this.onMouseMove);
  }

  onMouseMove(event) {
    // draw a stroke between the last position and the current position
    let cursor = this.cursor(event);
    this.draw(this._lastCursor, cursor, this.brush.color, this.brush.size);
    this._lastCursor = cursor;
  }

  /*
   * Touch Hooks
   */

  onTouchDown(event) {
    this._lastCursor = this.cursor(event.changedTouches[0]);
    this.canvas.addEventListener('touchmove', this.onTouchMove);
  }

  onTouchUp(event) {
    this.canvas.removeEventListener('touchmove', this.onTouchMove);
  }

  onTouchMove(event) {
    let cursor = this.cursor(event);
    this.draw(this._lastCursor, cursor, this.brush.color, this.brush.size);
    this._lastCursor = cursor;
  }

  /*
   * Sketching functions
   */

  /* Paints a stroke on the canvas
   *
   * @param {Object} start Object determining the {x, y} to start drawing
   * @param {Object} end Object determining the {x, y} to end drawing
   * @param {String} color Which color to be used when drawing
   * @param {Number} size The size of the stroke to be drawn
   * @param {String} compositeOperation The operation to be used on the canvas.
   *                                    Check canvas documentation for further
   *                                    details.
   */
  stroke(start, end, color, size, compositeOperation) {
    this.context.save();

    this.context.lineJoin = 'round';
    this.context.lineCap = 'round';
    this.context.strokeStyle = color;
    this.context.lineWidth = size;
    this.context.globalCompositeOperation = compositeOperation;
    this.context.beginPath();
    this.context.moveTo(start.x, start.y);
    this.context.lineTo(end.x, end.y);
    this.context.closePath();
    this.context.stroke();

    this.context.restore();
  }

  /* Draw a stroke on the canvas
   *
   * Wrapper on top o stroke method
   *
   * @sa stroke
   */
  draw(start, end, color, size) {
    this.stroke(start, end, color, size, 'source-over');
  }
};
