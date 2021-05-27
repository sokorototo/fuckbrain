/**
 * This library has a heavy reliance on various ES6 features:
 *  [Interators] (https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Iterators_and_Generators)
 *      [Symbol.iterator] (https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#the_iterator_protocol)
 *  [Array Methods] (https://developer.mozilla.org/en-US/docs/Glossary/First-class_Function, https://eloquentjavascript.net/05_higher_order.html)
 *  [Maps] (https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map)
 *  [Classes and Static Methods] (https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes)
 */

import Machine from "./fuckbrain.max.mjs";
import {readFileSync} from "fs";

console.clear();
let machine = new Machine({ bitSize: 3 });

let then = Date.now();
[
    "examples/bench/skiploop.bf",
    "examples/oobrain.bf",
    "examples/char.bf",
    "examples/asciiart/chess.bf",
    "examples/password-vault.bf",
    "examples/utm.bf",
    "examples/jabh.bf",
    "examples/cell-size-5.bf",
    "examples/passtest.bf"
]
.map(file => machine.run(readFileSync(file, "utf8"), Machine.StringInputGenerator("b1b1bbb1c1c11111d") ))
.map(arr => arr.join(""))
.forEach(str => console.log(str));

console.log(`Execution took: ${Date.now() - then}ms`);