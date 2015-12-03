module.exports = class Pointer {
  constructor(id) {
    this.id = id;

    this.div = document.createElement('div');

    this.setSize('5px');

    this.div.style.backgroundColor = '#000';

    this.div.style.position = 'absolute';
    this.div.style.top = '-100px';
    this.div.style.left = '-100px';

    this.div.style.opacity = '1';
    this.setAnimation('fade-in 700ms ease-out');

    document.getElementById('pointers').appendChild(this.div);
  }

  setSize(size) {
    this.size = parseFloat(size.replace('px', ''));
    this.div.style.width = size;
    this.div.style.height = size;
    this.div.style.borderRadius = size;

  }

  setAnimation(style) {
    this.div.style.animation = style;
    this.div.style.oAnimation = style;
    this.div.style.msAnimation = style;
    this.div.style.mozAnimation = style;
    this.div.style.webkitAnimation = style;
  }

  moveTo(x, y) {
    // fade-in animation when some motion occur
    this.div.style.opacity = '1';
    this.setAnimation('fade-in 700ms ease-out');

    this.div.style.top = (y - (this.size / 2)) + 'px';
    this.div.style.left = (x - (this.size / 2)) + 'px';

    // fade-out animation when no motion occur on a given time
    this.timeout && clearTimeout(this.timeout);
    this.timeout = setTimeout(() => {
      this.div.style.opacity = '0'
      this.setAnimation('fade-out 700ms ease-out');
    }, 750);
  }

  remove() {
    this.div.remove();
  }
}
