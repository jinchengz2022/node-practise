// 用于 http 传输数据时的 gzip、deflate、brotli 等压缩格式
// header 中的 accept-encoding

import zlib from "node:zlib";
import http from "node:http";
import fs from "node:fs";
import { pipeline } from "node:stream/promises";

const server = http.createServer(async (req, res) => {
  const raw = fs.createReadStream("index.html");

  const acceptEncoding = req.headers["accept-encoding"] || "";

  try {
    if (/\bdeflate\b/.test(acceptEncoding)) {
      res.writeHead(200, { "Content-Encoding": "deflate" });
      await pipeline(raw, zlib.createDeflate(), res);
    } else if (/\bgzip\b/.test(acceptEncoding)) {
      res.writeHead(200, { "Content-Encoding": "gzip" });
      await pipeline(raw, zlib.createGzip(), res);
    } else if (/\bbr\b/.test(acceptEncoding)) {
      res.writeHead(200, { "Content-Encoding": "br" });
      await pipeline(raw, zlib.createBrotliCompress(), res);
    } else {
      res.writeHead(200, {});
      await pipeline(raw, res);
    }
  } catch (error) {
    res.end();
  }
});

server.listen(8000);
