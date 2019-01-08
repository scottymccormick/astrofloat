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
}

class Asteroid extends Mass {
  constructor() {
    super(50, 50, 'asteroid');

    content.appendChild(this.div);
    this.fly();
  }
  fly() {
    // generate random starting point
    // select direction - y is vert, x is horiz
    const axis = Math.random() > 0.5 ? 'y' : 'x';
    // const axis = 'y';
    // select one side or other
    // const direction = Math.random() > 0.5 ? '+' : '-';
    const direction = '+'

    const startPoint = [0, 0];
    const endPoint = [0, 0];
    if (axis === 'x') {
      startPoint[0] = -49;
      startPoint[1] = Math.floor(Math.random() * (screenHeight - 50));
      endPoint[0] = screenWidth + this.dimensions.x; 
      endPoint[1] = (Math.random() * (screenHeight + 50)) - startPoint[1];
    } else {
      startPoint[0] = Math.floor(Math.random() * (screenWidth - 50));
      startPoint[1] = -49;
      endPoint[0] = (Math.random() * (screenWidth + 50)) - startPoint[0];
      endPoint[1] = screenHeight + this.dimensions.y;
    }
    this.move(startPoint, 0, false);
    this.move(endPoint, 5000, true);
  }
  move ([x, y], time, end) {
    let flying = anime({
      targets: this.div, 
      translateX: this.position.x += x,
      translateY: this.position.y += y,
      duration: time,
      easing: 'linear',
      elasticity: 0,
      run: (anim) => {
        if (this.intersects(person)) {
          console.log('collision');
        }
      },
      complete: () => {if (end) this.outOfBounds()}
    });
  }
  intersects(obj) {
    let objAPos = this.getPosition();
    let objBPos = obj.getPosition();

    return (objAPos.x > (objBPos.x - obj.dimensions.x) && 
        objAPos.x < (objBPos.x + obj.dimensions.x) &&
        objAPos.y > (objBPos.y - obj.dimensions.y) && 
        objAPos.y < (objBPos.y + obj.dimensions.y));
  }
  outOfBounds() {
    this.div.remove();
    console.log('destroyed asteroid');
  }
}

class Person extends Mass {
  constructor() {
    super(50, 50, 'astronaut');
    
    content.appendChild(this.div);
    let that = this;

    // initial movement
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

    this.asteroids = [];
    setTimeout(() => {
      this.releaseAsteroids(20);
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
    console.log(person.position)
  }
  releaseAsteroids(limit) {
    let count = 0;
    let asteroidInterval = setInterval(() => {
      count++;
      if (count >= limit) {
        clearInterval(asteroidInterval)
      }
      this.asteroids.push(new Asteroid());
    }, 2000);
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