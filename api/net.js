// 创建 tcp 连接
import net from "node:net";

const server = net.createServer((clientSocket) => {
  console.log("client socket connect");

  clientSocket.on("data", (data) => {
    console.log(data.toString());

    clientSocket.write("hello");
  });

  clientSocket.on("end", () => {
    console.log("connect interrupt");
  });
});

server.listen(6666, "localhost", () => {
  const address = server.address();

  console.log("listened address：%j", address);
});
