<script setup>
  import { onMounted, getCurrentInstance } from 'vue';
  import WordGameEngine from './classes/WordGameEngine.js'

  // ======================
  // Initialization
  // ======================

  const instance = getCurrentInstance();
  console.log(instance);

  // initialize the game straight away
  const game = new WordGameEngine(4, 4);
  game.init();
  game.resetGame();

  // easy reference for DOM elements later
  const dom = {
    scorebox: null,
  };

  // after markup is in, store a cell's UI element with the engine's cell object for easy lookup later
  onMounted(() => {
    game.cellsList.forEach( cell => {
      cell.userDef = document.querySelector(`#grid-r${cell.row}c${cell.col}`);
    });

    dom.scorebox = document.getElementById('game-status__scorebox');
    dom.selectedLetters = document.getElementById('game-selectedletters-container');
  });

  // ======================
  // UI handlers
  // ======================

  function onCellClick ( e, cell ) {
    var result = game.selectCell( cell );

    if (result === "success") {
      e.srcElement.classList.add('selected');

      // update list of selected letters
      dom.selectedLetters.innerHTML = game.selectedLetters.toUpperCase();
    }
  }

  function onSubmitClick () {
    if ( game.submitWord( game.selectedLetters ) === true ) { // word is valid, hasn't been used before

      // save word in score box
      dom.scorebox.innerHTML += '' + game.selectedLetters.toUpperCase() + '<br>';

      // clear selections
      game.clearSelections();
      clearCellSelections();
      
    } else {
      console.log("TRY AGAIN");
    }
  }

  function onClearClick () {
    game.clearSelections();

    // reset all cells
    clearCellSelections();
  }

  function onNewGameClick () {
    game.resetGame();

    // reset all cells
    clearCellSelections();

    // clear score box
    dom.scorebox.innerHTML = '';

    // vue forceupdate
    // TO-DO: make grid a componenet and use :key method of updating so we're not needlessly redrawing entire application
    instance.proxy.$forceUpdate();
  }

  // ======================
  // Helper functions
  // ======================

  function clearCellSelections () {
    game.cellsList.forEach( cell => {
      cell.userDef.classList.remove('selected');
    });

    // clear selected letters display
    dom.selectedLetters.innerHTML = '';
  }
</script>


<template>
  <div class="content-row">

    <div class="game-container">

      <div class="game-selectedletters-container" id="game-selectedletters-container">
        
      </div>

      <div class="cell-grid">
        <template v-for="(row, rowIndex) in game.grid">
          <div v-for="(cell, colIndex) in row" class="grid-cell" @click="onCellClick($event, cell)" :id="'grid-r'+cell.row+'c'+cell.col" >
            {{ cell.letter }}
          </div>
        </template>
      </div>

      <div class="game-status-container">
        <!-- TIME GOES HERE -->
        Words
        <hr>
        <div class="game-status__scorebox" id="game-status__scorebox">
          <!-- found words listed here -->
        </div>
      </div>

      <div class="game-interface-container">
        <button @click="onClearClick()" class="game-button">Clear</button>
        <button @click="onSubmitClick()" class="game-button">Submit</button>
        <button @click="onNewGameClick()" class="game-button">New Game</button>
      </div>

    </div>
  </div>
</template>


<style scoped>
  .game-container {
    display: grid;
    grid-template-columns: auto 1fr;
    grid-template-rows: 50px auto auto;
    column-gap: 10px;
    row-gap: 10px;

    width: 600px;
  }

  .game-selectedletters-container {
    width: 100%;

    display: flex;
    justify-content: center;
    flex-direction: row;
    align-items: end;
    text-align: center;
    letter-spacing: 0.2em;
    text-indent: 0.2em;
    overflow-wrap: break-word;
    word-break: break-all;

    padding-bottom: 5px
  }

  .game-status-container {
    grid-column-start: 2;
    grid-row-start: 2;
    grid-row-end: 3;

    padding: 0px 10px;
  }

    .game-status-container hr {
      margin-top: 5px;
      margin-bottom: 10px;
      border: 0px;
      border-top: 1px solid #333333;
    }

  .cell-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    grid-row-start: 2;
    /* grid-template-rows: repeat(4, 1fr); */
    gap: 5px;
    width: 315px;
  }

  .grid-cell {
    border: 0px solid #444444;
    border-radius: 5px;
    width: 75px;
    height: 75px;
    text-align: center;
    font-size: 28px;
    text-transform: uppercase;

    /* verticall align text */
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;

    background-color: #333333;
    cursor: pointer;
  }

  .grid-cell.selected {
    background-color: var(--orange-dark);
  }

  .game-interface-container {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    row-gap: 10px;

    width: 100%;
    grid-row-start: 3;
  }
  
  .game-button {
    width: 48.2%;
  }

  /* first game button */
  .game-button:first-of-type {
    margin-right: 10px;
  }

  .game-button:last-of-type {
    width: 100%;
    background-color: var(--ui-gray-dark);
    color: var(--ui-gray-medium);
  }

  .game-button:last-of-type:hover {
    background-color: var(--ui-gray-medium);
    color: var(--ui-gray-dark);
  }
</style>
