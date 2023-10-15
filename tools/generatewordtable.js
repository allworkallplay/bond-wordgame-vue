const fs = require('fs');
const jsesc = require('jsesc');

// load words
var words = fs.readFileSync('./wordlist.txt').toString().split("\n");

const letters = "abcdefghijklmnopqrstuvwxyz".split('');

const table = {};

// create lookup table structure
letters.forEach( (letter) => {
    table[letter] = {};

    letters.forEach( (letter2) => {
        table[letter][letter2] = [];
    });
});

// loop through all words and place them correctly
words.forEach( (word) => {
    if (word.length > 2) {
        const firstLetter = word[0];
        const secondLetter = word[1];

        table[word[0]][word[1]].push(word);
    }
});

// write out the table
fs.writeFileSync('./wordtable.js', jsesc(table));