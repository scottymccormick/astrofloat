const Mass = require('../js/Mass');

module.exports = class Projectile extends Mass {
  constructor(width, height, type, speed) {
    super(width, height, type);
    this.active = true;
    this.speed = game.levelRates[type].speed;
    this.spread = game.levelRates[type].spread;
  }
  release(duration) {
    const points = this.createPaths();

    this.move(points[0], 0, false);
    this.animation = this.move(points[1], 10000 / this.speed, true);
  }
  createPaths() {
    const axis = Math.random() > 0.5 ? 'x' : 'y';
    const direction = Math.random() > 0.5 ? '+' : '-';
    
    const startPoint = this.generatePoint(axis, direction);
    const endPoint = this.generatePoint(axis, direction, startPoint)
    return [startPoint, endPoint];
  }
  generatePoint(axis, direction, startPoint) {
    const point = [0, 0];
    if (!startPoint) {
      if(axis === 'x') {
        point[0] = direction === '+' ? -this.dimensions.x : screenWidth;
        point[1] = Math.random() * (screenHeight + this.dimensions.y) - this.dimensions.y;
      } else { // axis === 'y'
        point[0] = Math.random() * (screenWidth + this.dimensions.x) - this.dimensions.x;
        point[1] =  direction === '+' ? -this.dimensions.y : screenHeight;
      }
    } else { // startPoint exists
      if (axis === 'x') {
        point[0] = (direction === '+' ? 1 : -1) * (screenWidth + this.dimensions.x); 
        point[1] = (Math.random() * this.spread * (screenHeight + this.dimensions.y)) - startPoint[1];
      } else { // axis === 'y'
        point[0] = (Math.random() * this.spread * (screenWidth + this.dimensions.x)) - startPoint[0];
        point[1] = (direction === '+' ? 1 : -1) * (screenHeight + this.dimensions.y);
      }
    }
    return point;
  }
  move ([x, y], time, end) {
    return anime({
      targets: this.div, 
      translateX: this.position.x += x,
      translateY: this.position.y += y,
      duration: time,
      easing: 'linear',
      elasticity: 0,
      run: (anim) => {
        if (this.intersects(game.person) && this.active) {
          this.collides();
        }
      },
      complete: () => {
        if (end) {
          this.completesPath()
        }
      }
    });
  }
  collides() {
    console.log(`Collision`);
  }
  completesPath() {
    this.div.remove();
  }
}