import fs from "node:fs";
import { EOL } from "node:os";
import path from "node:path";


// fs.mkdirSync("fs-test");

// setTimeout(() => {
//   fs.renameSync("fs-test", "fs-mkdir");
// }, 2000);

// setTimeout(() => {
//   fs.rmdirSync("fs-mkdir");
// }, 4000);

// fs.writeFileSync("aaa.txt", "morning" + EOL);

// setTimeout(() => {
//   fs.appendFileSync("aaa.txt", "jack" + EOL);
// }, 2000);

// setTimeout(() => {
//   fs.unlinkSync("aaa.txt"); // 删除文件
// }, 3000);

fs.mkdirSync("aa/bb/cc/dd", {
  recursive: true,
});
fs.writeFileSync("aa/1.txt", "hello");
fs.writeFileSync("aa/bb/2.txt", "lucy");
fs.writeFileSync("aa/bb/cc/3.txt", "good");
fs.writeFileSync("aa/bb/cc/dd/4.txt", "morning");

function copyDir(srcDir, destDir) {
  fs.mkdirSync(destDir, { recursive: true });

  for (const file of fs.readdirSync(srcDir)) {
    const srcFile = path.resolve(srcDir, file);
    const destFile = path.resolve(destDir, file);

    copy(srcFile, destFile);
  }
}

function copy(src, dest) {
    const stat = fs.statSync(src); // 获取文件信息
    if(stat.isDirectory()) {
        copyDir(src, dest);
    } else {
        console.log(src, dest);
        fs.copyFileSync(src, dest);
    }
}

copy('aa', 'aa2')
// 或一下两种方法可实现 copy
// fs.cpSync('aa', 'aa3')  node 22版本后才不是实验性 api
// import fse from 'fs-extra'
// fse.copySync('./api', './aa')