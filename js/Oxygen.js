const Projectile = require('./Projectile');

module.exports = class Oxygen extends Projectile {
  constructor(idNumber) {
    super(26, 39, 'oxygen');
    // this.div.innerHTML = 'O<sub>2</sub>'
    this.id = `oxygen-${idNumber}`;
  }
  collides() {
    this.active = false;
    game.person.affectStatus(30, 'air');
    super.completesPath();
  }
  release() {
    content.appendChild(this.div);
    super.release();
  }
  completesPath() {
    const deadIdx = game.oxygens.findIndex((oxygen) => {
      return oxygen.id === this.id;
    });
    game.oxygens.splice(deadIdx, 1);
    super.completesPath();
  }
}