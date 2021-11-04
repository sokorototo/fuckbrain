importScripts(["https://cdn.jsdelivr.net/npm/fuckbrain"]);
let machine = new Machine();
console.log("[WORKER]", "Successfully initialized");

this.addEventListener("message", (evt) => {
    try {
        let { code, input } = JSON.parse(evt.data), then = Date.now();
        let output = machine.run(code, Machine.StringInputGenerator(input)).join("");
        postMessage(JSON.stringify({
            error: false,
            output: `[EXECUTION] ${Date.now() - then}ms: (OK)\n\n${output}`
        }))
    } catch (error) {
        console.log(error);
        postMessage(JSON.stringify({
            error: true,
            output: `[EXECUTION] ${Date.now() - then}ms: (ERROR)\n\n${error.message}`
        }))
    }
})