const path = require('node:path');

const filePath = __filename; // 当前文件路径

const filePath1 = path.join('../', 'api', './', 'path.js');
console.log('filePath1', filePath1);

const filePath2 = path.resolve('../', 'api', './', 'path.js'); // 连接多个路径并返回一个绝对路径
console.log('filePath2', filePath2);
console.log('relative', path.relative('/a/b/c', '/a/d')); // a 到 d 的相对路径
console.log('parse', path.parse(__filename));

console.log(filePath);
console.log('dirname', path.dirname(filePath));
console.log('basename', path.basename(filePath));
console.log('extname', path.extname(filePath));


// esModule
// import path from 'node:path'
// import { fileURLToPath } from 'node:url'

// const esModuleFilePath = fileURLToPath(import.meta.url);