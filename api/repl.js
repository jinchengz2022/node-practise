// 可交互式执行脚本
import repl from 'node:repl'

const r = repl.start({prompt: '>', eval: myEval})

// cmd 用户输入内容
// context node api
// callback 结束处理
function myEval(cmd, context, filename, callback) {
    console.log(`你的命令:${cmd}`);
    callback();
}