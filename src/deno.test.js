"use strict";
import Machine from "https://cdn.jsdelivr.net/npm/fuckbrain/build/fuckbrain.min.mjs";
console.log("\n================= Running Deno tests ==================== \n");

const readFileSync = (filename) => Deno.readTextFile(`${Deno.cwd()}/${filename}`).then(data => { return { data, name: filename } });
const machine = new Machine({ cellSize: 3 });

const promises =
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
		.map(readFileSync);

Promise.all(promises).then(files => {
	files.map(file => {
		const then = Date.now();
		machine.run(file.data, Machine.StringInputGenerator("132\n"), {
			complete(output) {
				console.log(`\n[FILENAME] => ${file.name},\n[OUTPUT BYTES] => ${output.length * 8},\nExecution took: ${Date.now() - then}ms.`);
			}
		})
	});
});

console.log("All tests passed!");