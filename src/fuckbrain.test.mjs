"use strict";
console.log("\n================= Running Node.js tests ==================== \n");

import { readFileSync } from "fs";
import Machine from "../build/fuckbrain.min.mjs";

let machine = new Machine({ cellSize: 3 });

[
	"examples/cell-size-1.bf",
	"examples/bench/prttab.bf",
	"examples/bench/skiploop.bf",
	"examples/bottles-3.bf",
	"examples/oobrain.bf",
	"examples/asciiart/chess.bf",
	"examples/196.bf",
	"examples/reverse.bf",
	"examples/utm.bf",
	"examples/jabh.bf",
	"examples/torture.bf"
]
	.map(file => {
		console.time(`[PERFORMANCE] => ${file}, took`);
		machine.run(readFileSync(file, "utf8"), Machine.StringInputGenerator("132\n"), {
			complete(output) {
				console.log(`\n[FILENAME] => ${file},\n[OUTPUT BYTES] => ${output.length * 8}`);
				console.timeEnd(`[PERFORMANCE] => ${file}, took`);
			}
		})
	});

console.log("All tests passed!");