import readline from 'node:readline'

const repeatCount = process.stdout.rows - 2;
const blank = repeatCount > 0 ? '\n'.repeat(repeatCount) : ''

readline.cursorTo(process.stdout, 0, 0);
readline.clearScreenDown(process.stdout)

// console.log('jincheng\u001B[1Khahahaha');
console.log('epiphany\u001b[36;1;4mhhhhhhhh\u001b[0m xxxxxxx');