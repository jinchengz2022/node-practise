// 一次性执行多个进程
import cluster from "node:cluster";
import http from "node:http";
import { cpus } from "node:os";

const numCPU = cpus().length;

if (cluster.isPrimary) {
  for (let i = 0; i < numCPU; i++) {
    cluster.fork();
  }

  cluster.on("fork", (worker) => {
    console.log("worker create success", worker.id);
  });

  cluster.on("exit", (worker, code, signal) => {
    console.log("worker exit ", worker.id);
  });
} else {
  const server = http.createServer(async (req, res) => {
    res.writeHead(200);
    res.end("hello judy\n");
  });

  server.listen(8000);

  setTimeout(() => {
    process.exit();
  }, 2000);
}
