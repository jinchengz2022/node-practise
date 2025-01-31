// 按行读取文件、读取用户输入、处理键盘事件
import { createReadStream } from 'node:fs'
import { createInterface } from 'node:readline'

const rl = createInterface({
    input: createReadStream('./os.js'),
})

rl.on('line', (line) => {
    console.log('line info：', line);
})