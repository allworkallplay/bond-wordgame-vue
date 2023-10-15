import WordTable from './WordTable.js';

export default class WordGameEngine {

    constructor ( rows, columns ) {
        // game constants
        this.rows = rows;           // number of rows in grid
        this.columns = columns;     // number of columns in grid
        this.grid = [];             // 2D array of cell objects; grid[row][column]
        this.cellsList = [];        // convenience 1D list of all cells in grid; avoids grid[][] iterations in all-cell operations
        this.consonants = 'bcdfghjklmnpqrstvwxyz'; // consonants
        this.vowels = 'aeiou';      // vowels
        this.wordTree = {};         // lookup table for valid words

        // game state
        this.foundWords = [];       // list of found words, in order of discovery
        this.selectedCells = [];    // list of references to selected cell objects, in order clicked
        this.selectedLetters = '';  // string of letters selected by user, in order clicked
    }

    init () {
        let row,col,rowcells;

        // create grid and cells
        for (row=0; row<this.rows; row++) { // for every row
            this.grid[row] = [];
            for (col=0; col<this.columns; col++) {  // for every column
                // creation of cell objects
                this.grid[row][col] = {
                    row: row,
                    col: col,
                    letter: '',
                    selected: false,
                    selectableNeighbors: [],
                    userDef: null,  // user-defined data. can be used to store references to dom elements, threejs objects, anything relevant outside of this engine
                };

                this.cellsList.push( this.grid[row][col] );
            }
        }

        // fill in each cell's selectableNeighbors
        this.cellsList.forEach( (cell) => {
            // row above me
            if (cell.row > 0) { // if not the top row already
                rowcells = this.grid[cell.row-1];
                if (typeof rowcells[cell.col-1] !== "undefined") cell.selectableNeighbors.push( this.grid[cell.row-1][cell.col-1] );
                if (typeof rowcells[cell.col] !== "undefined") cell.selectableNeighbors.push( this.grid[cell.row-1][cell.col] );
                if (typeof rowcells[cell.col+1] !== "undefined") cell.selectableNeighbors.push( this.grid[cell.row-1][cell.col+1] );
            }

            // adjacent neighbors
            rowcells = this.grid[cell.row];
            if (typeof rowcells[cell.col-1] !== "undefined") cell.selectableNeighbors.push( this.grid[cell.row][cell.col-1] );
            if (typeof rowcells[cell.col+1] !== "undefined") cell.selectableNeighbors.push( this.grid[cell.row][cell.col+1] );

            // row below me
            if (cell.row < this.rows-1) {   // if not the bottom row already
                rowcells = this.grid[cell.row+1];
                if (typeof rowcells[cell.col-1] !== "undefined") cell.selectableNeighbors.push( this.grid[cell.row+1][cell.col-1] );
                if (typeof rowcells[cell.col] !== "undefined") cell.selectableNeighbors.push( this.grid[cell.row+1][cell.col] );
                if (typeof rowcells[cell.col+1] !== "undefined") cell.selectableNeighbors.push( this.grid[cell.row+1][cell.col+1] );
            }
        });

        // define word tree
        this.wordTree = WordTable;      // assign the generated, imported wordtable.js file to this.wordTree

        // create timer
        // create score
    }

    //===========================================================================
    // Game State
    //===========================================================================

    startGame () {
        // reset game
        // begin timer
    }

    endGame () {
        // tally score
    }

    resetGame () {
        this.foundWords = [];
        this.selectedCells = [];
        this.selectedLetters = '';
        this.clearSelections();
        this.resetBoard();
        // reset timer
    }

    //===========================================================================
    // Game Logic
    //===========================================================================

    resetBoard () {
        let i, imax, cellidx;

        // fill entire grid with consonants
        this.cellsList.forEach( (cell) => {
            cell.letter = this.consonants[ this.randRange(0, this.consonants.length-1) ];
        });

        // sprinkle some vowels
        imax = this.randRange(4, 5);    // 4 to 5 vowels
        for (i=0;i<imax;i++) {
            // TO-DO: ensure we don't use a cell we already put a vowel in
            cellidx = this.randRange(0, this.cellsList.length-1);   // pick a random cell in the grid
            this.cellsList[cellidx].letter = this.vowels[ this.randRange(0, this.vowels.length-1) ];    // assign a radnom vowel to that cell
        }

        // TESTING ONLY
        // this.cellsList.forEach( (cell, i) => {
        //     cell.letter = this.consonants[i];
        // });
    }

    evalSelectedWord ( word ) {
        let evalReturn = {
            valid: false,   // is the word valid?
            status: 'notfound', // exists | point | notfound
        };

        // has it been found already?
        this.foundWords.forEach( (foundWord) => {
            if (foundWord == word) {
                evalReturn = {
                    valid: true,
                    status: 'exists'
                }
            }
        });
        
        // is the word valid?
        if ( evalReturn.status === 'notfound' && typeof this.wordLookup( word ) === 'string' ) {
            evalReturn = {
                valid: true,
                status: 'point'
            }
        }

        return evalReturn;
    }

    //===========================================================================
    // Player Triggered Actions
    //===========================================================================

    selectCell ( cell ) {
        let myreturn = "notallowed";   // success | already | notallowed
        let lastcell = this.selectedCells[ this.selectedCells.length-1 ] || null;

        // check if cell is allowed
        if (lastcell !== null) {
            lastcell.selectableNeighbors.forEach( (neighbor) => {
                if (cell === neighbor) {    // clicked cell is a valid neighbor of previously selected cell
                    if ( cell.selected === false ) {     // not already selected
                        this.selectedCells.push( cell );
                        this.selectedLetters += cell.letter;
                        myreturn = "success";
                    } else {
                        myreturn = "already";
                    }
                }
            });
        } else {    // null lastcell must mean this is the first cell selected
            this.selectedCells.push( cell );
            this.selectedLetters += cell.letter;
            myreturn = "success";
        }

        if (myreturn === "success") cell.selected = true;

        return myreturn
    }

    submitWord ( word ) {
        let wordeval = this.evalSelectedWord( word );
        let myreturn = false;   // false = ultimately no point, true = ultimately gained a point

        if (wordeval.valid === true && wordeval.status === "point") {
            this.foundWords.push( word );
            myreturn = true;
        }   // else myreturn stays false

        return myreturn;
    }

    clearSelections () {
        this.selectedCells.forEach( (cell) => {
            cell.selected = false;
        });

        this.selectedCells = [];
        this.selectedLetters = '';
    }

    //===========================================================================
    // Helpers
    //===========================================================================

    wordLookup ( word ) {   // it feels weird to label this function a "helper" :shrug:
        let found = null;
        let sublist = [];

        if ( typeof word !== 'string' || word.length < 2 ) {    // if we got something weird as an argument
            return found;   // bail and return null

        } else {    // otherwise, drill down the word tree and grab the word list we should check against
            try {   // theoretically this should never throw an error, but complex lookups...well...you never know
                sublist = this.wordTree[word[0]][word[1]];
            } catch (e) {
                console.log("ERROR: ", e);
                return found;
            }
        }

        if (sublist && sublist.length > 0) { // if we found a list of words to check against
            sublist.forEach( (listword) => {
                if (listword === word) {
                    found = word;
                }
            });
        }   // else "found" just stays null and gets returned

        return found;
    }

    // TO-DO: use better randomizer than Math.random()
    randRange (min, max) { // inclusive of min and max 
        return Math.floor(Math.random() * (max - min + 1) + min)
    }
}