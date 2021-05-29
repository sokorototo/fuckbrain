/**
 * This library has a heavy reliance on various ES6 features:
 *  [Interators] (https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Iterators_and_Generators)
 *      [Symbol.iterator] (https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#the_iterator_protocol)
 *  [Array Methods] (https://developer.mozilla.org/en-US/docs/Glossary/First-class_Function, https://eloquentjavascript.net/05_higher_order.html)
 *  [Maps] (https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map)
 *  [Classes and Static Methods] (https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes)
 */

"use strict";
const Machine = require("../build/fuckbrain.min.js");
const { readFileSync } = require("fs")

let machine = new Machine({ cellSize: 3 });

[
    "examples/bench/skiploop.bf",
    "examples/oobrain.bf",
    "examples/char.bf",
    "examples/asciiart/chess.bf",
    "examples/password-vault.bf",
    "examples/reverse.bf",
    "examples/utm.bf",
    "examples/jabh.bf",
    "examples/cell-size-5.bf",
    "examples/passtest.bf"
]
.map(file => {
    let then = Date.now();
    machine.run(readFileSync(file, "utf8"), Machine.StringInputGenerator("b1b1bbb1c1c11111d"), {
        write( char ){
            process.stdout.write(char)
        },
        complete( output ){
            console.log(`\n[FILENAME] => ${file},\n[OUTPUT BYTES] => ${output.length * 8},\nExecution took: ${Date.now() - then}ms.\n`);
        }
    })
});