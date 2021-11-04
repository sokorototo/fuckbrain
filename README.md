<p align="center">
  <img src="https://raw.githubusercontent.com/sokorototo/fuckbrain/master/media/fuckbrain%20logo.png"alt="Fuckbrain logo" width="180" height="180">
</p>
<h1 align=center>
  <strong>f*ckbrain</strong>
</h1>
<p align=center> Another <a href="https://esolangs.org/wiki/Brainfuck">Brainfuck</a> interpreter written in JavaScript,</p>
<p align=center> - Customizable and Easy to use · Works in the Browser, Node and Deno - </p>
<p align=center>
  <a href="https://github.com/sokorototo/fuckbrain"><img alt="NPM" src="https://img.shields.io/npm/l/fuckbrain"></a> |
  <a href="https://www.npmjs.com/package/fuckbrain"><img alt="npm" src="https://img.shields.io/npm/v/fuckbrain"></a> |
  <a href="https://www.npmjs.com/package/fuckbrain"><img alt="npm" src="https://img.shields.io/npm/dw/fuckbrain"></a> |
  <a href="https://bundlephobia.com/package/fuckbrain"><img alt="npm bundle size" src="https://img.shields.io/bundlephobia/min/fuckbrain"></a> |
  <a href="https://github.com/sokorototo/fuckbrain/issues"><img alt="GitHub issues" src="https://img.shields.io/github/issues/sokorototo/fuckbrain"></a>
</p>
<p align=center>
 <a href="https://www.npmjs.com/package/fuckbrain">npm</a> | <a href="#deno">deno.land</a> | <a href="https://sokorototo.github.io/fuckbrain/">Try it</a>
</p>

----

### 🐣  _Introduction_

##### _fuckbrain_ is a dead simple brainfuck interpreter. It has no dependencies nor bloat. Uses a loop instead of recursion. Covers the full, ( yet small ) brainfuck language spec, correctly. _fuckbrain_ also comes with detailed error reporting and customizable input and output streaming. The interpreter does not offer any form of optimizations, yet. Besides various aspects of a given `Machine` instance, ( what runs the .bf ) can be customized; bits per cell, length of the tape and its `InstructionSet`. You can try a demo [here](https://sokorototo.github.io/fuckbrain/)

----

### 🥼 _Why I made this_

- I love code, its what I do 🥽.
- I was watching a video by [TheHappieCat](https://youtu.be/-3C200nCwpk), and I thought to myself, "Hmm, I could probably write a brainfuck interpreter."
- To prove to myself I ain't a cabbage-potato programmer. ¯\\\_(ツ)_/¯
- I wanted to learn how to write an interpreter.
- I want to design a programming language someday, an [esotlang](https://en.wikipedia.org/wiki/Esoteric_programming_language) maybe?

----

### ⏬ *Installation*

##### CDN

Deliver the package via a cdn:

- jsdelivr:

  ```http
  https://cdn.jsdelivr.net/npm/fuckbrain
  ```

- unpkg:

  ```http
  https://unpkg.com/fuckbrain
  ```

##### npm

```bash
npm install fuckbrain
```

##### yarn

```bash
yarn add fuckbrain
```

##### Embedded

Include the file `fuckbrain.min.js` , from `build/` in your project directory. Then:

- Browser:

  ```html
  <script src="path/to/fuckbrain.min.js">
  ```

- Node:

  ```javascript
  const Machine = require("path/to/fuckbrain.min.js");
  ```

##### ES6 Module

In the build directory is an es6 module of the library. The main|default import of the module id the `Machine` class:

```javascript
import Machine from "fuckbrain.min.mjs";
```

##### Deno

```javascript
import Machine from "https://cdn.jsdelivr.net/npm/fuckbrain/build/fuckbrain.min.mjs";
```

----

### ⛽ ***Prerequisite***

To ensure that _fuckbrain_ [just works](https://www.youtube.com/watch?v=YPN0qhSyWy8) ensure the following JavaScript features are available; If not get some [polyfills](https://github.com/zloirock/core-js) or consider using a transpiler 🐱‍🐉.

> [Iterators] (<https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Iterators_and_Generators>)*
>
> ​ [Symbol.iterator] (<https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#the_iterator_protocol>)*
>
> [Maps] (<https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map>)*

----

### 🛠 *Basic Usage*

To run basic brainfuck code, with as little configuration as possible:

```javascript
import Machine from "fuckbrain.min.mjs";

let code = "++++++++++[>+++++++>++++++++++>+++>+<<<<-]>++.>+.+++++++..+++.>++.<<+++++++++++++++.>.+++.------.--------.>+.>.";

let myMachine = new Machine();

let output = myMachine.run(code);

console.log(output);
// -> ["H", "e", "l", "l", "o", ",", " ", "w", "o", "r", "l", "d", "!"]

console.log(output.join(""));
// Hello, world!
```

Because brainfuck code outputs values one byte at a time, the resultant  output is an array of ASCII `char` values. As you would expect, it also expects input one at a time. Brainfuck ingests input as integers, depending on your cellSize. To send data to brainfuck, _fuckbrain_ employs the standard [Iterator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#the_iterator_protocol) protocol to allow the user to use their own input stream implementation( **input what you want, how you want, when you want it, as long as it's an integer** ). Anyways, its quite easy to produce a stream of integers  from a `String`, thanks to ASCII character conversion and a static helper method in the `Machine` class, `Machine.StringInputGenerator`:

```javascript
import Machine from "fuckbrain.min.mjs";

let reverse = "+[>,]<-[+.<-]"; // Reverses its input and spits it out

let myMachine = new Machine();

let output = myMachine.run(brainfuck, Machine.StringInputGenerator("ToiletPaper"));
console.log(output.join(""));
// repaPtelioT
```

A **`Machine.BrowserPromptInputGenerator`** method exists so a [prompt](https://developer.mozilla.org/en-US/docs/Web/API/Window/prompt) popup appears in the browser when input is needed. **Do not use this generator in node.js**. This method takes an argument, a question to be shown on the popup, defaults to _"[INPUT] Brainfuck asks of your input, leave empty to exit:"_. An empty answer terminates the stream, probably inform the user:

```javascript
import Machine from "fuckbrain.min.mjs";

let reverse = "+[>,]<-[+.<-]"; // Reverses its input and spits it out

let myMachine = new Machine();

let output = myMachine.run(reverse, Machine.BrowserPromptInputGenerator());

console.log(output.join(""));
// sapmuLapmU
```

Output is also available instantaneously, just provide an object with a **`write`** method as a third parameter to **`machine.run()`** and this method will be called every time output is available. You can just wait for execution to complete and receive an array as a return value of **`machine.run()`**:

```javascript
import Machine from "fuckbrain.min.mjs";

let tt = "--------[-->+++<]>.."; // The text "tt"

let myMachine = new Machine();

let outputWriter = {
  data: [],
  write( char ){
    this.data.push("s" + char + "er")
  },
  complete( output ){
    // Called with the same output that would be returned by machine.run()
    console.log( output ); // -> [ "t", "t" ]
  }
};

myMachine.run(tt, Machine.BrowserPromptInputGenerator(), outputWriter);
console.log(myWriter.data.join(""));
// sterster
```

----

### 🦸‍♂️ Advanced Usage

> **All these settings are optional and have defaults if not defined;**

- _Manually set the length of the tape_:

  ```javascript
  import Machine from "fuckbrain.min.mjs";

  let myMachine = new Machine({
  // 4500 cells, defaults to 30000
  length: 4500
  });
  ```

- *Specify the cell size, ( **number of bits per cell** )*:

  ```javascript
  import Machine from "fuckbrain.min.mjs";

  let myMachine = new Machine({
  // 16 bits per cell, -- MUST be a power of 2, defaults to 8 bits per cell --
  cellSize: 16
  });
  ```

- _Define your own custom instructions:_ Define a function that is bound to an instruction. This function is called when the instruction is met along the tape. It also gives the instruction meaning and prevents it from getting filtered out during optimizations. Use this to add debugging functionality or extend the **`InstructionSet`** in many various creative and *spooky* ways. To maintain basic functionality I advise extending the built-in instruction set instead of building on from the ground up on your own, you can if you want tho;

  ```javascript
  import Machine from "fuckbrain.min.mjs";

  let custom = Machine.InstructionSet(); // A JavaScript map

  custom.set("!", (machine, code, input, output) => {
  // A debug instruction that spits out some information
  console.log(`[STACK, POINTER]`, machine.stack, machine.pointer)
  });

  let myMachine = new Machine({
  InstructionSet: custom
  });
  ```

  The function passed takes four arguments; **`machine`** a reference to the machine instance running the brainfuck code, this includes all its properties and methods,  **`code`** an array containing all instructions waiting to be executed ( NOTE this is not the code passed to  **`machine.run()`** as a first argument but a filtered version containing only _viable_ instructions ),  **`input`**a reference to the input iterator passed to **`machine.run()`**as a second argument, **`output`** a reference to the output object passed as the third argument to  **`machine.run()`**.

### ⚙ *The Machine Instance*

A "machine" is what runs your brainfuck. I assume you know how brainfuck works. It has a **`tape`**, which is basically an "infinite" array of cells initialized at zero. A **`pointer`** which points to a specific cell in the **`tape`**. Also, your brainfuck code is an array of instructions. An execution pointer points to an instruction in that array. A **`machine`** has all these represented as properties, you can access and them alter them:

```javascript
import Machine from "fuckbrain.min.mjs";

let machine = new Machine();

machine.pointer // ( Number ) The memory pointer's location along the tape

machine.execution // ( Number ) The instruction pointer's location along the instruction tape

machine.tape // ( TypedArray ) The tape

machine.stack // [ Number ] The stack, used for storing the last location of a "[" instruction within the instruction tape

machine.metadata // ( Object ) This allows you to attach some arbitrary data

machine.terminate() // Terminates and resets the machine
```

All these properties are reset after your brainfuck is done executing. No need to create another machine instance to run more brainfuck, just **`machine.run()`**  again.

----

### 🤘 *Example*

We want to give brainfuck the following features:

- The pointer has a storage cell that it carries  around, a sort of bag.
- It can read the value of the cell it's currently on and put it into storage with **`v`**.
- It inject the value currently in storage into the cell it's currently on with **`^`**.
- Prematurely terminate execution with **`#`**.

```javascript
import Machine from "fuckbrain.min.mjs";

let custom = Machine.InstructionSet(); // A JavaScript map

custom.set("v", (machine) => {
 // Read data from current cell and put to storage
 machine.metadata.storage = machine.tape[machine.pointer];
});

custom.set("^", (machine) => {
 // Read data from storage and inject into current cell
 machine.tape[machine.pointer] = machine.metadata.storage || machine.tape[machine.pointer];
});

custom.set("#", (machine) => {
 // Kill the machine
 machine.terminate();
});

let machine = new Machine({ InstructionSet: custom });

let code = "++++v>^<.>.#>+[>+]";
let output = machine.run(code);
console.log(output.join("")); // ♦♦

// I call this brainfuck flavour: "bagfuck"
```

----

### 👌 *Implementation Details*

- **`0 - 1 == 255`**, values wrap around.
- The memory pointer does not wrap around, therefore **`machine.pointer - 0 == 0`**
- If input **`Iterator`** finishes all further input prompts default to **`0`**
- Outputs `Number` values by default. Input in`String` format.

> These are for the default **Machine.InstructionSet**, you can obviously create your own instruction set from bottom to top with vastly different rules.

----

### 🎁 *Extras*

- I would really love some feedback.
- For any issues, go [here](https://github.com/sokorototo/fuckbrain/issues).
- Give me your best and worst opinions on my code.
- Please leave a [star](https://github.com/sokorototo/fuckbrain/stargazers)
