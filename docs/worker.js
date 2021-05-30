importScripts(["https://cdn.jsdelivr.net/npm/fuckbrain"]);
let machine = new Machine();
console.log("[WORKER]", "Successfully initalized");

this.addEventListener("message", ( evt ) => {
    try {
        let {code, input} = JSON.parse(evt.data);
        let output = machine.run(code, Machine.StringInputGenerator(input)).join("");
        postMessage(JSON.stringify({
            error: false,
            output
        }))
    } catch (error) {
        console.log(error);
        postMessage(JSON.stringify({
            error: true,
            output: error.message
        }))
    }
})