const EventEmitter = require("node:events");

class MyEmitter extends EventEmitter {}

const myEmitter = new MyEmitter();

myEmitter.on("aaa", (data) => {
  console.log("aaa event", data);
});

myEmitter.on("bbb", (data) => {
  console.log("bbb event", data);
});

myEmitter.once('ccc', (data) => {
    console.log('ccc once', data);
})

myEmitter.emit("aaa", 123);
myEmitter.emit("bbb", 456);
myEmitter.emit("ccc", 111111);
myEmitter.emit("ccc", 222222);
