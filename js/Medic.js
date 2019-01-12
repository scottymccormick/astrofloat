const Projectile = require('./Projectile');

module.exports = class Medic extends Projectile {
  constructor(idNumber, speed) {
    super(40, 40, 'medic', speed);
    this.id = `medic-${idNumber}`;
  }
  collides() {
    this.active = false;
    game.person.affectStatus(50, 'health');
    super.completesPath();
  }
  release() {
    content.appendChild(this.div);
    super.release();
  }
  completesPath() {
    const deadIdx = game.medics.findIndex((medic) => {
      return medic.id === this.id;
    });
    game.medics.splice(deadIdx, 1);
    super.completesPath();
  }
}