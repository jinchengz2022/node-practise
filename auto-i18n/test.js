import { transformFromAstSync } from "@babel/core";
import { jsxExpressionContainer } from "@babel/types";
import parser from "@babel/parser";
import template from "@babel/template";
import prettier from "prettier";
// import generator from "@babel/generator";
import fs from "node:fs";
import path from "node:path";

// async function transform(content, filePath) {
//   const ast = parser.parse(content, {
//     sourceType: "module",
//     plugins: ["jsx"],
//   });

//   const res = transformFromAstSync(ast, content, {
//     plugins: [myPlugin],
//     retainLines: true,
//   });
//   console.log(res?.code);
//   const formatedCode = await prettier.format(res?.code, {
//     filepath: filePath,
//   });

//   // 改写对应文件内容
//   fs.writeFileSync(filePath, formatedCode, "utf8", (err) => {
//     if (err) {
//       console.error("写入文件时出错:", err);
//       return;
//     }
//     console.log("文件内容已成功改写。");
//   });
// }

// 递归遍历目录并读取文件内容的异步函数
// async function traverseDirectoryAsync(dir) {
//   try {
//     // 读取目录下的所有文件和子目录
//     const files = await fs.promises.readdir(dir);
//     for (const file of files) {
//       const filePath = path.join(dir, file);
//       const stats = await fs.promises.stat(filePath);
//       if (file === "node_modules") {
//         continue;
//       }
//       if (stats.isDirectory()) {
//         // 如果是目录，递归调用该函数处理子目录
//         await traverseDirectoryAsync(filePath);
//       } else {
//         // 如果是文件，读取文件内容
//         const content = await fs.promises.readFile(filePath, {encoding: 'utf-8'});
//         if (!content) {
//           continue;
//         }
//         transform(content, filePath);
//       }
//     }
//   } catch (err) {
//     console.error("Error traversing directory:", err);
//   }
// }

// // 根目录路径
// const rootDirectory = "./main"; // 当前目录
// traverseDirectoryAsync(rootDirectory).then(() => {
//   console.log("Traversal completed.");
// });

function myPlugin() {
  return {
    visitor: {
      Program(path) {
        let index = 0;

        while (path.node.body[index].type === "ImportDeclaration") {
          index++;
        }

        let moduleName1 = "defineMessages";
        let moduleName2 = "useIntl";

        if (path.scope.getBinding(moduleName1)) {
          moduleName1 = path.scope.generateUid(moduleName1);
        }

        if (path.scope.getBinding(moduleName2)) {
          moduleName2 = path.scope.generateUid(moduleName2);
        }

        const ast = template.statement(
          `import {${moduleName1}, ${moduleName2}} from 'react-intl'`
        )();
        path.node.body.splice(index, 0, ast);

        const textArr = [];
        // 找到所有 jsx text
        path.traverse({
          JSXText(p) {
            if (p.node.value.trim() !== "") {
              textArr.push(p.node.value);
            }
          },
          // JSXExpressionContainer(eee) {
          //   if (eee.node.expression.name && eee.node.expression.name?.trim?.() !== "") {
          //     textArr.push(eee.node.expression.name);
          //   }
          // },
        });

        const messagesAst = template.statement(`{
            ${textArr.map((i) => `"${i}": {id: "${i}"}`).join(",")}
          }
       `)();
        path.node.body.splice(index + 1, 0, messagesAst);
      },
      FunctionDeclaration(path, state) {
        if (path.parent.type === "Program") {
          let methodName = "useIntl";
          if (path.scope.getBinding(methodName)) {
            methodName = path.scope.generateUid(methodName);
          }

          const ast = template.statement(
            `const ${methodName} = ${methodName}();`
          )();
          path.node.body.body.unshift(ast);

          state.intlName = methodName;
        }
      },
      JSXText(path, state) {
        if (path.node.value.trim() !== "") {
          const ast = template.expression(
            `${state.intlName}.formatMessage(messages["${path.node.value}"])`
          )();

          path.replaceWith(jsxExpressionContainer(ast));
        }
      },
    },
  };
}

const content = `import { useState } from 'react'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div>
      <div>{count}</div>
      <button onClick={() => setCount(count => count + 1)}>增{count}加</button>
      <button onClick={() => setCount(count => count - 1)}>减小</button>
    </div>
  )
}

export default App`;
const ast = parser.parse(content, {
  sourceType: "module",
  plugins: ["jsx"],
});

const res = transformFromAstSync(ast, content, {
  plugins: [myPlugin],
  retainLines: true,
});
console.log(res?.code);
const formatedCode = await prettier.format(res?.code, {
  filepath: "./main/a.tsx",
});
