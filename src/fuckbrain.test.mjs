"use strict";
console.log("\n================= Running Node.js tests ==================== \n");

import { readFileSync } from "fs";
import Machine from "../build/fuckbrain.min.mjs";
import assert from "assert";

let machine = new Machine();

let inputs = {
	"examples/cell-size-1.bf": 264,
	"examples/bench/prttab.bf": 5208,
	"examples/bench/skiploop.bf": 24,
	"examples/bottles-3.bf": 90872,
	"examples/oobrain.bf": 1840,
	"examples/asciiart/chess.bf": 21648,
	"examples/196.bf": 368,
	"examples/reverse.bf": 32,
	"examples/utm.bf": 8,
	"examples/jabh.bf": 240,
	"examples/torture.bf": 136
};


Object.keys(inputs).forEach(file => {
	console.time(`[PERFORMANCE] => ${file}, took`);
	machine.run(readFileSync(file, "utf8"), Machine.StringInputGenerator("132\n"),
	{
		complete(output) {
			const outputSize = output.length * 8;
			assert(outputSize == inputs[file], `[FILE: ${file}] output an invalid number of bytes: ${outputSize} != ${inputs[file]}`);

			console.log(`\n[FILENAME] => ${file},\n[OUTPUT BYTES] => ${outputSize}`);
			console.timeEnd(`[PERFORMANCE] => ${file}, took`);
		}
	})
});

console.log("\n================= All tests passed! ==================== \n");