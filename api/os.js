import os from 'node:os'

console.log('a' + os.EOL + 'a' + os.EOL + 'b' ); // 换行符

console.log('os.cpu', os.cpus()); // cpu

console.log('os.type', os.type()); // 系统类型

console.log('os.userInfo', os.userInfo()); // 用户信息

console.log('os.freemem', os.freemem()); // 可用内存

console.log('os.totalmem', os.totalmem()); // 总内存

console.log('os.homedir', os.homedir()); // 目录

console.log('os.networkInterfaces', os.networkInterfaces()); // 网卡信息




