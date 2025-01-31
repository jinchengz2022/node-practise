// 创建子进程，父子之间进行通信
import cp from "node:child_process";

const ls1 = cp.spawn("ls", ["-l", "./"]);

ls1.stdout.on("data", (data) => {
  console.log("stdout：", data.toString("utf-8"));
});

ls1.stderr.on("data", (data) => {
  console.error("stderr：", data);
});

ls1.on("close", (code) => {
  console.log("process end：", code);
});

const ls2 = cp.exec("ls -l");
ls2.stdout.on("data", (data) => {
  console.log("stdout：", data.toString("utf-8"));
});

ls2.stderr.on("data", (data) => {
  console.error("stderr：", data);
});

ls2.on("close", (code) => {
  console.log("process end：", code);
});

const child = cp.execFile('') // 执行可执行文件

cp.fork('./fs.js') // 跑 js 进程
