/*----- constants -----*/
/*----- app's state (variables) -----*/

let game, person;

class Person {
  constructor() {
    this.domObject = document.createElement('div');
    this.domObject.classList.add('astronaut');
    this.dimensions = {x: 50, y: 50};
    this.position = {x: 0, y: 0};

    content.appendChild(this.domObject);

    let that = this;
    // initial movement
    anime({
      targets: that.domObject,
      translateX: [{value: 325, duration: 0}],
      translateY: [{value: 200, duration: 0}],
      scale: [
        {value: 0, duration: 100},
        {value: 1, duration: 3000, delay: 100}
      ],
      
      opacity: [{value: 1, delay: 100, duration: 2000}],
      rotate: [{value: '3turn', delay: 100, duration: 3000}],
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
      targets: this.domObject, 
      translateX: this.position.x += x,
      translateY: this.position.y += y,
      elasticity: 0,
      duration: 0
    });
    
    // detect if out of bounds
    if (this.position.x < -this.dimensions.x || 
      this.position.y < -this.dimensions.y ||
      this.position.y > game.screenHeight ||
      this.position.x > game.screenWidth) game.over()
  }

}

class Game {
  constructor(){
    this.round = 1;
    this.active = true;
    this.screenWidth = content.offsetWidth;
    this.screenHeight = content.offsetHeight;

    this.keys = {};
    window.addEventListener('keydown', (e) => {
      this.keys[e.code] = true;
    });
    window.addEventListener('keyup', (e) => {
      this.keys[e.code] = false;
    });
    
    console.log('Game constructed');

    person = new Person();

    
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
  }
} 

/*----- cached element references -----*/

const content = document.querySelector('#content');
const initActions = document.createElement('section');
const $gameOverMsg = $('<h2>Game Over</h2>').addClass('game-over');

/*----- event listeners -----*/

// document.addEventListener('keydown', keyPressed);

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