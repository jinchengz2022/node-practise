// readStream 可读流
// duplexStream 双工流
// writeStream 可写流
// transformStream 转换流
import { Writable, Duplex, Transform } from 'node:stream'

// class MyWritable extends Writable {
//     constructor(iterator) {
//         super();
//         this.iterator = iterator;
//     }

//     _write(data, enc, next) {
//         console.log(data.toString());
//         setTimeout(() => {
//             next();
//         }, 1000);
//     }
// }

// function createWriteStream() {
//     return new MyWritable();
// }
// const writeStream = createWriteStream();
// writeStream.on('finish', () => console.log('done'));

// writeStream.write('lallalallalal');
// writeStream.write('hahahaha')
// writeStream.end();


// class MyDuplex extends Duplex {
//     _read() {
//         this.push('lalallalla');
//         this.push('hahahahha');
//         this.push(null);
//     }

//     _write(data, enc, next) {
//         console.log('__write', data.toString());
//         setTimeout(() => {
//             next();
//         }, 1000);
//     }
// }

// const duplexStream = new MyDuplex();
// duplexStream.on('data', data => {
//     console.log('duplexStream.on data', data.toString());
// })

// duplexStream.on('end', data => {
//     console.log('read done');
// })

// duplexStream.write('xixixixixixi');
// duplexStream.write('hehehhehe');
// duplexStream.end();

// duplexStream.on('finish', data => {
//     console.log('write done');
// })

class MyTransform extends Transform {
    _transform(buf, enc, next) {
        const res = buf.toString().split('').reverse().join('');
        this.push(res);

        next();
    }
}

const transformStream = new MyTransform();
transformStream.on('data', data => console.log(data.toString()))
transformStream.on('end', data => console.log('read done'));

transformStream.write('111111111111111');
transformStream.write('999999999999999');
transformStream.write('777777777777777');
transformStream.end();
transformStream.on('finish', data => console.log('write done'))