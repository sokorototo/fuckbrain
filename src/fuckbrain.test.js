"use strict";
const Machine = require("../build/fuckbrain.min.js");
const { readFileSync } = require("fs")

let machine = new Machine({ cellSize: 3 });

[
    "examples/bench/skiploop.bf",
    "examples/oobrain.bf",
    "examples/asciiart/chess.bf",
    "examples/password-vault.bf",
    "examples/reverse.bf",
    "examples/utm.bf",
    "examples/jabh.bf",
    "examples/cell-size-5.bf",
    "examples/passtest.bf"
]
.map(file => {
    const then = Date.now();
    machine.run(readFileSync(file, "utf8"), Machine.StringInputGenerator("b1b1bbb1c1c11111d"), {
        write( char ){
            process.stdout.write(char)
        },
        complete( output ){
            console.log(`\n[FILENAME] => ${file},\n[OUTPUT BYTES] => ${output.length * 8},\nExecution took: ${Date.now() - then}ms.\n`);
        }
    })
});