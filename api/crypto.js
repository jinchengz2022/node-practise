import crypto, { createHash } from "node:crypto";
import { Readable } from "node:stream";

function md5(str) {
  const hash = crypto.createHash("md5");
  hash.update(str);

  return hash.digest("hex");
}

const pwd = md5("jincheng");
console.log({ pwd });

const rs = new Readable();
rs._read = function () {
  this.push("jincheng");
  this.push(null);
};

const hash = createHash("md5");
rs.pipe(hash).setEncoding("hex").pipe(process.stdout);

// 生成随机数
const random1 = crypto.randomInt(10);
const random2 = crypto.randomInt(10);
const random3 = crypto.randomInt(10);

// uuid
const uid1 = crypto.randomUUID();
const uid2 = crypto.randomUUID();

console.log({ random1, random2, random3, uid1, uid2 });
