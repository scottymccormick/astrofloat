const Mass = require('./Mass');

module.exports = class Person extends Mass {
  constructor() {
    super(50, 50, 'astronaut');
    this.health = 100;
    this.air = 100;
    this.animationDuration = 2100;
    content.appendChild(this.div);

    // this.entryAnimation();
  }
  entryAnimation() {
    let that = this;
    const initialX = (screenWidth / 2) - (this.dimensions.x / 2);
    const initialY = (screenHeight / 2) - (this.dimensions.y / 2);
    
    anime({
      targets: that.div,
      translateX: [{value: initialX, duration: 0}],
      translateY: [{value: initialY, duration: 0}],
      scale: [
        {value: 0, duration: 100},
        {value: 1, duration: 2000, delay: 100}
      ],
      opacity: [{value: 1, delay: 100, duration: 1000}],
      rotate: [{value: '2turn', delay: 100, duration: 2000}],
      complete: function(anim) {
        that.position.x = initialX;
        that.position.y = initialY;
        // temporarily delay onset on keyDetection
        setTimeout(() => {game.keyDetect()}, 30);
      }
    });    
  }
  affectStatus (amount, type) {
    const attribute = type;
    const progress = `${type}Progress`;
    if (amount + this[attribute] > 100) {
      this[attribute] = 100;
    } else {
      this[attribute] += amount;
    }
    
    anime({
      targets: game[progress],
      value: this[attribute],
      duration: 0,
      easing: 'linear'
    });
    if (this[attribute] === 0) {
      game.gameOver();
    }
  }
  setAirLoss(toLose) {
    if (toLose) {
      this.airInterval = setInterval(() => {
        if (this.air <= 0) {
          game.gameOver();
        }
        this.air -= 0.25;
        anime({
          targets: game.airProgress,
          value: this.air,
          duration: 1,
          easing: 'linear'
        });
      }, 100)
    } else {
      clearInterval(this.airInterval);
    }
  }
  move ([x, y]) {
    anime({
      targets: this.div, 
      translateX: this.position.x += x,
      translateY: this.position.y += y,
      elasticity: 0,
      duration: 100
    });
    
    // detect if out of bounds
    if (this.position.x < -this.dimensions.x || 
      this.position.y < -this.dimensions.y ||
      this.position.y > screenHeight ||
      this.position.x > screenWidth) game.gameOver()
  }
  reset() {
    this.health = 100;
    this.air = 100;
  }
}