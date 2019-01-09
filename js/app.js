/*----- constants -----*/

const screenWidth = 700;
const screenHeight = 450;

/*----- app's state (variables) -----*/

let game, person;

class Mass {
  constructor(width, height, type) {
    this.div = document.createElement('div');
    this.div.classList.add(type);
    this.dimensions = {x: width, y: height};
    this.position = {x: 0, y: 0};
  }
  getPosition() {
    const parentPos = content.getBoundingClientRect();
    const childPos = this.div.getBoundingClientRect();
    return {x: childPos.left - parentPos.left, y: childPos.top - parentPos.top};
  }
  intersects(obj) {
    let objAPos = this.getPosition();
    let objBPos = obj.getPosition();

    return (objAPos.x > (objBPos.x - obj.dimensions.x) && 
        objAPos.x < (objBPos.x + obj.dimensions.x) &&
        objAPos.y > (objBPos.y - obj.dimensions.y) && 
        objAPos.y < (objBPos.y + obj.dimensions.y));
  }
}

class Projectile extends Mass {
  constructor(width, height, type, idNumber) {
    super(width, height, type);
    this.active = true;
  }
  release(duration) {
    const points = this.createPaths();

    this.move(points[0], 0, false);
    this.animation = this.move(points[1], duration || 5000, true);
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
        point[1] = (Math.random() * 1.4 * (screenHeight + this.dimensions.y)) - startPoint[1];
      } else { // axis === 'y'
        point[0] = (Math.random() * 1.4 * (screenWidth + this.dimensions.x)) - startPoint[0];
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
        if (this.intersects(person) && this.active) {
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
    // does something
    console.log(`Collision with something`);
  }
  completesPath() {
    this.div.remove();
  }
}

class Asteroid extends Projectile {
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
    this.div.style.backgroundColor = 'purple'; // add hit animation
    // reduce person's health
    setTimeout(() => {person.affectHealth(-1)}, 0);
  }
}

class Medic extends Projectile {
  constructor() {
    super(40, 40, 'medic');
  }
  collides() {
    this.active = false;
    person.affectHealth(50);
    super.completesPath();
  }
  release() {
    content.appendChild(this.div);
    super.release();
  }
}

class Person extends Mass {
  constructor() {
    super(50, 50, 'astronaut');
    this.health = 100;
    this.oxygen = 100;
    // create health and oxygen bars
    this.createStatusBars();
    content.appendChild(this.div);

    // initial movement
    this.entryAnimation();
    
  }
  entryAnimation() {
    let that = this;
    anime({
      targets: that.div,
      translateX: [{value: 325, duration: 0}],
      translateY: [{value: 200, duration: 0}],
      scale: [
        {value: 0, duration: 100},
        {value: 1, duration: 2000, delay: 100}
      ],
      
      opacity: [{value: 1, delay: 100, duration: 1000}],
      rotate: [{value: '2turn', delay: 100, duration: 2000}],
      complete: function(anim) {
        that.position.x = 325;
        that.position.y = 200;
        // temporarily delay onset on keyDetection
        setTimeout(game.keyDetect, 10);
      }
    });
  }
  createStatusBars() {
    this.healthProgress = document.createElement('progress');
    this.healthProgress.setAttribute('max', 100);
    this.healthProgress.setAttribute('value', this.health);
    this.healthProgress.setAttribute('id', 'health-progress')
    const healthLabel = document.createElement('label');
    healthLabel.setAttribute('for', 'health-progress')
    healthLabel.textContent = 'Health';

    this.oxygenProgress = document.createElement('progress');
    this.oxygenProgress.setAttribute('max', 100);
    this.oxygenProgress.setAttribute('value', this.oxygen);
    this.oxygenProgress.setAttribute('id', 'oxygen-progress');
    const oxygenLabel = document.createElement('label');
    oxygenLabel.setAttribute('for', 'oxygen-progress');
    oxygenLabel.textContent = 'Oxygen';

    this.progressBox = document.createElement('section');
    this.progressBox.classList.add('progress-box')

    this.progressBox.appendChild(healthLabel);
    this.progressBox.appendChild(this.healthProgress);
    this.progressBox.appendChild(document.createElement('br'))
    this.progressBox.appendChild(oxygenLabel);
    this.progressBox.appendChild(this.oxygenProgress);

    content.appendChild(this.progressBox);
  }
  affectHealth(amount) {
    this.health += amount;
    anime({
      targets: this.healthProgress,
      value: this.health,
      duration: amount > 0 ? 1000 : 100,
      easing: 'linear'
    });
    if (this.health === 0) {
      game.over();
    }
  }
  setOxygenLoss(toLose) {
    if (toLose) {
      this.oxygenInterval = setInterval(() => {
        if (this.oxygen <= 0) {
          game.over();
        }
        this.oxygen -= 0.25;
        anime({
          targets: this.oxygenProgress,
          value: this.oxygen,
          duration: 1,
          easing: 'linear'
        });
      }, 100)
    } else {
      clearInterval(this.oxygenInterval);
    }
  }
  move ([x, y]) {
    anime({
      targets: this.div, 
      translateX: this.position.x += x,
      translateY: this.position.y += y,
      elasticity: 0
    });
    
    // detect if out of bounds
    if (this.position.x < -this.dimensions.x || 
      this.position.y < -this.dimensions.y ||
      this.position.y > screenHeight ||
      this.position.x > screenWidth) game.over()
  }

}

class Game {
  constructor(){
    this.round = 1;
    this.active = true;
    this.asteroidCounter = 0;
    this.timer = 30;

    // attach key event listeners
    this.keys = {};
    window.addEventListener('keydown', (e) => {
      this.keys[e.code] = true;
    });
    window.addEventListener('keyup', (e) => {
      this.keys[e.code] = false;
    });
    
    console.log('Game constructed');

    // create astronaut
    person = new Person();

    // add timer to window
    this.createTimer();

    this.asteroids = [];
    setTimeout(() => {
      this.releaseAsteroids(40);
      // begin losing oxygen
      person.setOxygenLoss(true);
      this.releaseMedic();
      this.startTimer(25);
    }, 2000)
  }
  keyDetect (e) {
    let x = game.keys['ArrowLeft'] ? -1 : 0 + game.keys['ArrowRight'] ? 1 : 0;
    let y = game.keys['ArrowUp'] ? -1 : 0 + game.keys['ArrowDown'] ? 1 : 0;
    x *= 5;
    y *= 5;
    if (x !== 0 || y !== 0) {
      person.move([x, y])
      // e.preventDefault();
    };
    if (game.active) setTimeout(game.keyDetect, 20);
  }
  over() {
    $(content).append($gameOverMsg);
    game.active = false;

    clearInterval(this.asteroidInterval);
    clearInterval(person.setOxygenLoss(false));
    
    for (let i = 0; i < this.asteroids.length; i++) {
      if (this.asteroids[i]){
        console.log(this.asteroids[i].animation)
        this.asteroids[i].animation.pause();
        // undergo some destruction animation
      }
    }
  }
  releaseAsteroids(limit) {
    let count = 0;
    this.asteroidInterval = setInterval(() => {
      count++;
      if (count >= limit) {
        clearInterval(this.asteroidInterval)
      }
      const asteroid = new Asteroid(this.asteroidCounter++);
      // const asteroidKey = asteroid.id;
      // const asteroidObj = {};
      // asteroidObj[asteroidKey] = asteroid;
      asteroid.release();
      this.asteroids.push(asteroid);
      console.log(this.asteroids);
    }, 1000);
  }
  releaseMedic() {
    const medic = new Medic();
    setTimeout(() => {medic.release(10000)}, 3000);
  }
  createTimer() {
    this.timerElement = document.createElement('progress');
    this.timerElement.setAttribute('max', this.timer);
    this.timerElement.setAttribute('value', this.timer);
    this.timerElement.setAttribute('id', 'timer');

    this.timerLabel = document.createElement('label');
    this.timerLabel.textContent = 'Timer';
    this.timerLabel.setAttribute('for', 'timer');

    this.timerSection = document.createElement('section');
    this.timerSection.classList.add('timer-section');

    this.timerSection.appendChild(this.timerLabel);
    this.timerSection.appendChild(this.timerElement);

    content.appendChild(this.timerSection);

    
  }
  startTimer(start) {
    this.timerElement.setAttribute('max', start);
    this.timerElement.setAttribute('value', this.timer);
    this.timer = start;
    this.timerInterval = setInterval(() => {
      if (this.timer <= 0) {
        clearInterval(this.timerInterval);
        game.over();
      }
      this.timer--;
      anime({
        targets: this.timerElement,
        value: this.timer,
        round: 1,
        easing: 'linear'
      });      
    }, 1000)
  }
} 

/*----- cached element references -----*/

const content = document.querySelector('#content');
const initActions = document.createElement('section');
const $gameOverMsg = $('<h2>Game Over</h2>').addClass('game-over');

/*----- event listeners -----*/

/*----- functions -----*/

init();

function init() {
  console.log('Astrofloat initializted');

  // Add first buttons
  const $startBtn = $('<button/>').text('Start Game').on('click', newGame);
  $(initActions).append($startBtn);

  const $howToBtn = $('<button/>').text('How to Play');
  $(initActions).append($howToBtn);

  $(initActions).addClass('initial-actions')
  content.appendChild(initActions);

}

function newGame() {
  content.removeChild(initActions);

  console.log('New game started');
  game = new Game();
}