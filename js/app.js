/*----- constants -----*/
/*----- app's state (variables) -----*/

let game, person;

class Person {
  constructor() {
    this.domObject = document.createElement('div');
    this.domObject.classList.add('astronaut');
    this.position = {x: 0, y: 0};

    content.appendChild(this.domObject);

    let that = this;
    // initial movement
    anime({
      targets: that.domObject,
      translateX: 325,
      translateY: 200,
      duration: 1,
      complete: function(anim) {
        that.position.x = 325;
        that.position.y = 200;
      }
    });
    
  }
  move ([x, y]) {
    anime({
      targets: this.domObject, 
      translateX: this.position.x + x,
      translateY: this.position.y + y,
      elasticity: 0,
      duration: 0
    })
    this.position.x += x;
    this.position.y += y;
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

    setTimeout(this.keyLoop, 100);
  }
  keyLoop (e) {
    
    const x = game.keys['ArrowLeft'] ? -1 : 0 + game.keys['ArrowRight'] ? 1 : 0;
    const y = game.keys['ArrowUp'] ? -1 : 0 + game.keys['ArrowDown'] ? 1 : 0;
    person.move([x, y]);
    if (game.active) setTimeout(game.keyLoop, 20)
    
    // }
    
  }
} 

/*----- cached element references -----*/

const content = document.querySelector('#content');
const initActions = document.createElement('section');

/*----- event listeners -----*/

// document.addEventListener('keydown', keyPressed);

/*----- functions -----*/

init();

function init() {
  console.log('Astrofloat initializted');

  // Add first buttons
  const startBtn = document.createElement('button');
  startBtn.textContent = 'Start Game';
  startBtn.addEventListener('click', newGame);
  initActions.appendChild(startBtn);

  const howToBtn = document.createElement('button');
  howToBtn.textContent = 'How to Play';
  initActions.appendChild(howToBtn);

  initActions.classList.add('initial-actions')
  content.appendChild(initActions);

}

function newGame() {
  content.removeChild(initActions);

  console.log('New game started');
  game = new Game();
}