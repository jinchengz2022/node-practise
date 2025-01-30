import http from 'node:http'
import fs, { write } from 'node:fs'

const server = http.createServer(async (req, res) => {
    const writeStream = fs.createWriteStream('aaa.txt', 'utf-8');

    req.pipe(writeStream);

    res.write('6666666');
    res.end('done');
})

server.listen(8000);