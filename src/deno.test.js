"use strict";
import Machine from "https://cdn.jsdelivr.net/npm/fuckbrain/build/fuckbrain.min.mjs";
const readFileSync = (filename) => Deno.readTextFile(filename).then( data => { return { data ,name: filename } });

let machine = new Machine({ cellSize: 3 });

let promises = [
    "examples/bench/skiploop.bf",
    "examples/oobrain.bf",
    "examples/asciiart/chess.bf",
    "examples/password-vault.bf",
    "examples/reverse.bf",
    "examples/utm.bf",
    "examples/jabh.bf",
    "examples/cell-size-5.bf",
    "examples/passtest.bf"
].map( readFileSync );

Promise.all(promises).then(files => {
    files.map(file => {
        let then = Date.now();
        machine.run(file.data, Machine.StringInputGenerator("b1b1bbb1c1c11111d"), {
            complete( output ){
                console.log(`\n[FILENAME] => ${file.name},\n[OUTPUT BYTES] => ${output.length * 8},\nExecution took: ${Date.now() - then}ms.\n`);
            }
        })
    });
})