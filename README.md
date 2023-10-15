# BOND Word Game

To run, clone the repo then run `npm install`, then `npm run dev`.  
Open `http://localhost:[PORT]` in your browser. `[PORT]` is the port number that the server is running on.

## Word Table
The word table is a 2D dictionary of words, broken down to `dict[firstletter][secondletter][array list of words]`  
The current word list used to fill the table is derived from: https://raw.githubusercontent.com/syzer/google-10000-english/master/google-10000-english.txt
### Generating a new word lookup table
A javascript (not JSON) wordtable can be generated using the node.js tool and process below. This creates a new word table from a text list of words, removes words shorter than 3 characters, and writes the output into a JavaScript module.  
1. In `/tools`, put a line-break delimited word list in the file `wordlist.txt`
2. Run `npm install` the first time
3. Run `node generatewordtable.js` to generate and write out a new JS word table to `wordtable.js`
4. Copy the contents of `wordtable.js` into the value assignment `src/WordTable.js` and save  
  

##  Version 2 / Planned Improvements
- Add a timer
- Making the last-selected letter more obvious via highlight color
- Add rollovers to cells that indicate which letters can be selected and those that can't
- Improve the "randomization" of cell letters such that there are guaranteed number of words