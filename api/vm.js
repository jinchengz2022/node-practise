// 创建一个 js 执行环境
import vm from 'node:vm'

const context = {
    console,
    num1: 2,
    num2: 2023
}

vm.createContext(context);
vm.runInContext('console.log(num1 + num2)', context);