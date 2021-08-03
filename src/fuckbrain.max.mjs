"use strict";
class Machine{
	 constructor(config = {}){
		  // Default State Initialization
		  this.pointer = 0;
		  this.output = [];
		  this.stack = [];
		  this.execution = 0;
		  this.metadata = {};
		  this.__continue = true;

		  // Configurable State Initialization
		  this.length = config.length || 30000;
		  switch (config.cellSize || 1) {
				// Bits per cell
				case 1: 
					 // Meaning undefined cellSize, since it defaulted to 1
					 this.tape = new Uint8Array(this.length);
					 break;
				case 8:
					 this.tape = new Uint8Array(this.length);
					 break;
				case 16:
					 this.tape = new Uint16Array(this.length);
					 break;
				case 32:
					 this.tape = new Uint32Array(this.length);
					 break;
				default:
					 // cellSize was neither undefined nor any of the supported values
					 console.error(`[INFO] Unsupported cellSize: ${ config.cellSize }, defaulting to 8 bits per cell`);
					 this.tape = new Uint8Array(this.length);
					 break;
		  }
		  this.InstructionSet = config.InstructionSet || Machine.InstructionSet(1);
	 }

	 run(code, input, output) {
		  const brainfuck = [];
		  for (const instruction of code) {
				// filter out characters that are not instructions for speeeeeed
				if(this.InstructionSet.has(instruction)) brainfuck.push(instruction);
		  };

		  while (true && brainfuck.length !== 0) {
				if( !this.__continue ) break;
				try{
					 const instruction = brainfuck[this.execution];
					 this.InstructionSet.get(instruction)(this, brainfuck, input, output);
				} catch (e) {
					 throw new Error(`${e}; [MEMORY] ${this.pointer}; [EXECUTION] ${this.execution}; [STACK] ${ "[" + this.stack.join() + "]" }`);
				}
				this.execution ++;

				if (this.execution >= brainfuck.length) break;
		  }

		  const copy = this.output.slice();
		  this.reset();

		  // Forward output
		  if(output){
				if(typeof output.complete === "function") output.complete(copy);
		  };
		  return copy;
	 }
	 terminate(){
		  this.__continue = false;
	 }
	 reset(){
		  // Reset the machine
		  this.stack = [];
		  this.tape.fill(0);
		  this.execution = 0;
		  this.pointer = 0;
		  this.output = [];
		  this.metadata = {};
		  this.__continue = true;
	 }
	 
	 static InstructionSet(){
		  const InstructionSet = new Map();
		  InstructionSet.set("+", (machine) => {
				machine.tape[machine.pointer] ++
		  });
		  InstructionSet.set("-", (machine) => {
				machine.tape[machine.pointer] --
		  });
		  InstructionSet.set("<", (machine) => {
				if (machine.pointer > 0) machine.pointer --;
		  });
		  InstructionSet.set(">", (machine) => {
				if (machine.pointer < (machine.tape.length - 1)) machine.pointer ++;
		  });
		  InstructionSet.set("[", (machine, brainfuck) => {
				// If the "[" is at the last position, it obviously has no matching "]"
				if (machine.execution  === brainfuck.length - 1) throw new Error(`Unmatched "[" at last position: ${machine.pointer}`);

				// Basic "[" operation, if value at memory pointer is non zero then push this "[" to the stack and go on
				if (machine.tape[machine.pointer] !== 0) return machine.stack.push(machine.execution);
				
				// If value at memory pointer is zero, find matching "]"
				let tracker = 1;
				while (true) {
					 machine.execution ++;
					 
					 const instruction = brainfuck[machine.execution];
					 switch (instruction) {
						  case "[":
								tracker ++
								break;
						  case "]":
								tracker --
								break;
					 }

					 if (tracker === 0) return; // Matching "["" found

					 // End of brainfuck input
					 if (machine.execution >= (brainfuck.length - 1)) throw new Error(`Unmatched "["`);
				}
		  });
		  InstructionSet.set("]", (machine) => {
				// No matching "[" found in stack
				if(machine.stack.length === 0) throw new Error(`Unmatched "]"`);

				// Jump Unless Zero
				if(machine.tape[machine.pointer] === 0) return machine.stack.pop();
				machine.execution = machine.stack[machine.stack.length - 1];
		  });
		  InstructionSet.set(".", (machine, _, __, output) => {
				const currentValue = String.fromCharCode(machine.tape[machine.pointer]);
				if(output && typeof output.write === "function") output.write(currentValue);
				machine.output.push(currentValue);
		  })
		  InstructionSet.set(",", (machine, _, input) => {
				const next = input.next(), pointer = machine.pointer;
				if (next.done) return;

				// next.value must be a number
				if (typeof next.value !== "number") throw new Error("Encountered input not of type Number");
				machine.tape[pointer] = next.value || 0;
		  });

		  return InstructionSet
	 }

	 static StringInputGenerator( input ) {
		  return {
				input,
				index: 0,
				next(){
					 if (this.index > (this.input.length - 1)) return { done: true, value: 0 };
					 this.index ++;
					 return { done: false, value: this.input[this.index - 1].codePointAt(0) }
				},

				// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#the_iterator_protocol
				[Symbol.iterator](){ return this }
		  }
	 }
	 static BrowserPromptInputGenerator( question = "[INPUT] Brainfuck asks of your input, leave empty to exit:" ){
		  return {
				question,
				next(){
					 const answer = prompt(question, "");
					 if(answer) return { done: false, value: answer.codePointAt(0) };
					 return { done: true, value: 0 }
				},
				[Symbol.iterator](){ return this }
		  }
	 }
};

export default Machine;