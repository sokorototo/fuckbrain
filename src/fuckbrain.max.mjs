class Machine{
    constructor(config = {}){
        // Default State Initialization
        this.pointer = 0;
        this.output = [];
        this.stack = [];
        this.execution = 0;

        // Configurable State Initialization
        this.length = config.length || 30000;
        switch (config.bitSize || 1) {
            // Bits per cell
            case 1: 
                // Meaning undefned bitSize, since it defaulted to 1
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
                // bitSize was neither undefined nor any of the supported values
                console.error(`[INFO] Unsupported bitSize: ${ config.bitSize }, defaulting to 8 bits per cell`);
                this.tape = new Uint8Array(this.length);
                break;
        }
        this.InstructionSet = config.InstructionSet || Machine.InstructionSet(1);
    }

    run(brainfuck, input) {
        brainfuck = brainfuck.trim("").split("").filter(x => this.InstructionSet.has(x)) // Compress to one loop
        while (true) {
            try{
                let instruction = brainfuck[this.execution];
                this.InstructionSet.get(instruction)(this, brainfuck, input);
            }catch (e) {
                throw new Error(`${e}; [MEMORY] ${this.pointer}; [EXECUTION] ${this.execution}; [STACK] ${ "[" + this.stack.join() + "]" }`);
            }
            this.execution ++;

            if (this.execution >= brainfuck.length) break;
        }

        let copy = this.output.slice();
        this.reset();
        return copy;
    }
    reset(){
        // Reset the machine
        this.execution = 0;
        this.pointer = 0;
        this.output = [];
        this.stack = [];
        this.tape.fill(0);
    }
    
    static InstructionSet( type = 1 ){
        let InstructionSet = new Map();
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
            if (machine.execution  == brainfuck.length - 1) throw new Error(`Unmatched "[" at last position: ${machine.pointer}`); // The last "[" obviously has no pair
            if (machine.tape[machine.pointer] != 0) return machine.stack.push(machine.execution);
            
            // Jump If Zero
            let tracker = 1;
            while (true) {
                machine.execution ++;
                
                let instruction = brainfuck[machine.execution];
                switch (instruction) {
                    case "[":
                        tracker ++
                        break;
                    case "]":
                        tracker --
                        break;
                }

                if (tracker == 0) return; // Matching "["" found
                if (machine.execution >= (brainfuck.length - 1)) throw new Error(`Unmatched "[" at position: ${machine.pointer}`); // End of brainfuck input
            }
        });
        InstructionSet.set("]", (machine) => {
            // No matching "[" found in stack
            if(machine.stack.length == 0) throw new Error(`Unmatched "]"`);

            // Jump Unless Zero
            if(machine.tape[machine.pointer] == 0) return machine.stack.pop();
            machine.execution = machine.stack[machine.stack.length - 1];
        });
        InstructionSet.set(".", (machine) => {
             machine.output.push(String.fromCharCode(machine.tape[machine.pointer]))
        })
        InstructionSet.set(",", (machine, _, input) => {
            let next = input.next();
            if (next.done) {
                machine.tape[machine.pointer] = 0;
                return;
            };

            // next.calue must be either a number or a string
            if (typeof next.value != "number") throw new Error("Encountered input not of type Number");
            machine.tape[machine.pointer] = next.value || 0;
        });

        // Extra Varinats
        switch (type) {
            case 2:
                // Brainfuck Type 2
                break;
            case 3:
                // Brainfuck Type 3
                break;
        }

        return InstructionSet
    }

    static StringInputGenerator( input ) {
        return {
            input,
            index: 0,
            next(){
                if (this.index > (this.input.length - 1)) return { done: true, value: 0 };
                this.index ++;
                return { done: false, value: this.input[this.index - 1].charCodeAt(0) }
            },

            // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#the_iterator_protocol
            [Symbol.iterator](){ return this }
        }
    }
    static BrowserPromptInputGenerator( question = "[INPUT] Brainfuck asks of your input:" ){
        return {
            question,
            next(){
                let answer = prompt(question, "");
                if(!!answer) return { done: false, value: answer.charCodeAt(0) };
                return { done: true, value: 0 }
            },
            [Symbol.iterator](){ return this }
        }
    }
};

export default Machine;