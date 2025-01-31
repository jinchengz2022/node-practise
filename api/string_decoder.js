// 解析 buffer 字符串
import { StringDecoder } from "node:string_decoder";
import { Buffer } from "node:buffer";

const decoder = new StringDecoder("utf-8");

const buf = Buffer.from("今天天气真不错", "utf-8");

console.log(decoder.write(buf));
