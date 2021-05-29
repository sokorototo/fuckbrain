import { uglify } from "rollup-plugin-uglify";

export default [
    {
        input: './src/fuckbrain.max.mjs',
        output: {
            file: './build/fuckbrain.min.js',
            name: "Machine",
            format: 'umd'
        },
        plugins: [ uglify() ]
    },
    {
        input: './src/fuckbrain.max.mjs',
        output: {
            file: './build/fuckbrain.min.mjs',
            format: 'es'
        },
        plugins: [ uglify({
            ie8: false
        }) ]
    }
];