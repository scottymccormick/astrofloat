const Projectile = require('./Projectile');

module.exports = class Asteroid extends Projectile {
  constructor(idNumber) {
    super(50, 50, 'asteroid');
    this.id = `asteroid-${idNumber}`;
    content.appendChild(this.div);
  }
  completesPath() {
    const deadIdx = game.asteroids.findIndex((asteroid) => {
      return asteroid.id === this.id;
    });
    game.asteroids.splice(deadIdx, 1);
    super.completesPath();
  }
  collides() {
    if (!this.div.classList.contains('asteroid-hit')) {
      this.div.classList.add('asteroid-hit');
      setTimeout(() => {this.div.classList.remove('asteroid-hit')}, 1000)
    }
    
    game.person.affectStatus(-1, 'health');
  }
}