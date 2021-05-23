import {readFileSync} from "fs";

let commands = new Map();
commands.set("+", (machine) => {
    machine.tape[machine.pointer] ++
});
commands.set("-", (machine) => {
    machine.tape[machine.pointer] --
});
commands.set("<", (machine) => {
    if (machine.pointer > 0) machine.pointer --;
});
commands.set(">", (machine) => {
    machine.pointer ++;
    if (machine.pointer >= (machine.tape.length - 1)) machine.pointer = machine.tape.length;
});
commands.set("[", (machine, brainfuck) => {
    if (machine.tape[machine.pointer] != 0) {
        machine.stack.push(machine.execution);
    } else {
        let tracker = 0;
        while (true) {
            machine.execution ++;
            let instruction = brainfuck[machine.execution];
            if(!instruction) return;
            switch (instruction) {
                case "[":
                    tracker += 1
                    break;
                case "]":
                    tracker -= 1
                    break;
            }

            if (tracker < 0) return;
        }
    }
});
commands.set("]", (machine) => {
    if(machine.tape[machine.pointer] == 0) return machine.stack.pop();
    machine.execution = machine.stack[machine.stack.length - 1]
});
commands.set(".", (machine) => {
    machine.output.push(String.fromCharCode(machine.tape[machine.pointer]))
})
commands.set(",", (machine) => {
    machine.tape[machine.pointer] = machine.input.shift()?.charCodeAt(0) || 0;
});

let machine = {
    commands,
    tape: new Uint8Array(30000),
    pointer: 0,
    input: `PiEre`.split(""),
    output: [],
    stack: [],
    execution: 0,

    run(brainfuck) {
        brainfuck = brainfuck.split("".trim()).filter(x => this.commands.has(x)) //.forEach(command => machine.commands.get(command)(machine));
        while (true) {
            let instruction = brainfuck[this.execution];
            this.commands.get(instruction)(this, brainfuck);
            this.execution += 1;

            if (this.execution >= brainfuck.length) {
                break
            };
        }

        console.log(this.output.join(""));

        // Reset the machine
        this.execution = 0;
        this.pointer = 0;
        this.output = [];
        this.stack = [];
        this.tape.fill(0, 0, 49999);
    }
}

machine.run(readFileSync("examples/asciiart/text.bf", "utf8"));

/**
 * Extra functions coming:
 * (*) Read value from current storage
 * (&) Set value in current location to storage
 * (!) Send pointer to value in storage
 */