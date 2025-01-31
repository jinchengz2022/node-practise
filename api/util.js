import util from "node:util";

util.format("数字 %d 字符串 %s JSON %j 对象 %o"); // 字符串中加入占位符

// 获取调用堆栈信息 node 22以上
function callSites() {
  const call = util.getCallSites();
  call.forEach((site, index) => {
    console.log({
      index,
      fcName: site.functionName,
      scriptName: site.scriptName,
      lineNumber: site.lineNumber,
      column: site.column,
    });
  });
}

// 有 flag1 环境变量时打印
// exe -> NODE_DEBUG=flag1
const flag1 = util.debug('flag1');
if(flag1.enabled) {
    console.log('flag1 debug 日志');
} 

