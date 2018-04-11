const RAM = require('./ram');
const CPU = require('./cpu');

/**
 * Load an LS8 program into memory
 *
 * TODO: load this from a file on disk instead of having it hardcoded
 */
function loadMemory() {

    // Hardcoded program to print the number 8 on the console

    const data = process.argv[2];
    const fs = require('fs');
    const program = fs  
        .readFileSync(data, 'utf8')
        .split('\n')
        .reduce((mem, binary) => {
            if (binary[0] !== '#' && binary !== '') {
                return mem.concat([binary.slice(0, 8)]);
            } else {
                return mem;
            }
        }, []);
    // Load the program into the CPU's memory a byte at a time
    for (let i = 0; i < program.length; i++) {
        cpu.poke(i, parseInt(program[i], 2));
    }
} 
 
/**
 * Main
 */

let ram = new RAM(256);
let cpu = new CPU(ram);

// TODO: get name of ls8 file to load from command line
if (process.argv.length !== 3) {
    cpu.error();
} else {
// TODO: get name of ls8 file to load from command line
    loadMemory(cpu);
    cpu.startClock();
}