// ucp 通信

import dgram from 'dgram'
const server = dgram.createSocket('udp4');

server.on('message', (msg, info) => {
    const host = parseHost(msg.subarray(12))

    console.log('query：', host);

    if(/jincheng/.test(host)) {
        resolve(msg, info);
    } else {
        forward(msg, info)
    }
})