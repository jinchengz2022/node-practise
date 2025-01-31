import http from 'node:http'
import fs, { write } from 'node:fs'

const server = http.createServer(async (req, res) => {

    // req.headers['access-control-allow-credentials'] = '';
    // res.statusCode = 400;
    
    const writeStream = fs.createWriteStream('aaa.txt', 'utf-8');

    req.pipe(writeStream);

    res.write('6666666');
    res.end('done');
})

server.listen(8000);
// curl -X POST -d "name=guang&age=20" http://localhost:8000