// 创建工作线程
import { Worker, MessageChannel } from "node:worker_threads";

const { port1, port2 } = new MessageChannel();

const worker = new Worker("./worker_threads_work.js");
worker.postMessage(
  {
    value: 10,
    channel: port2,
  },
  [port2]
);

port1.on("message", (value) => {
  console.log({ res: value });
});
