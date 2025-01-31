import { Buffer } from 'node:buffer'

const buf1 = Buffer.alloc(10, 6);
const buf2 = Buffer.from('jincheng', 'utf-8');
const buf3 = Buffer.from([1,2,3]);

console.log(buf1.toString('hex'));
console.log(buf2.toString('utf-8'));
console.log(buf2.toString('base64'));
console.log(buf3.toString('hex'));

// LE 小端存储，一般用于处理本机数据
// BE 大端存储，一般用于解析网络协议
const buf4 = Buffer.alloc(10);
buf4.writeUint16LE(256, 0);
console.log(buf4.readUInt16LE(0));
console.log(buf4.readUInt8(0), buf4.readUInt8(1));