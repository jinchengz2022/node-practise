import readline from 'node:readline';

readline.emitKeypressEvents(process.stdin)

process.stdin.setRawMode(true);

process.stdin.on('keypress', (str, key) => {
    if(str === '\u0003') {
        process.exit();
    }
    console.log({str, key});
})