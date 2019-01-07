/*----- constants -----*/
/*----- app's state (variables) -----*/

let game;

class Game {
  constructor(){
    this.round = 1;
    console.log('Game constructed');
  }
} 

/*----- cached element references -----*/

const content = document.querySelector('#content');
const initActions = document.createElement('section');

/*----- event listeners -----*/
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
  console.log('New game started');
  game = new Game();

  if (!initActions.classList.contains('hidden')) initActions.classList.add('hidden');
}