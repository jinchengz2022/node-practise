// nodejs v8 内存信息
import v8 from 'node:v8'

// 堆内存每一部分统计信息
console.log(v8.getHeapSpaceStatistics());
// 堆内存整体信息
console.log(v8.getHeapStatistics());
