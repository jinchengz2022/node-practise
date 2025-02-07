import { transformFromAstSync } from "@babel/core";
import { jsxExpressionContainer } from '@babel/types'
import parser from "@babel/parser";
import template from "@babel/template";
import prettier from "prettier";

const sourceCode = `
import { useState } from 'react'
import './App.css'

const useIntl = 222;

function App() {
  const [count, setCount] = useState(0)

  return <div>
    <div>{count}</div>
    <button onClick={() => setCount(count => count + 1)}>增加</button>
    <button onClick={() => setCount(count => count - 1)}>减小</button>
  </div>
}

export default App
`;

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
        });
        const messagesAst =
          template.statement(`const messages = defineMessages({
            ${textArr.map((i) => `${i}: {id: "${i}"}`).join(",")}
          })
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
        if(path.node.value.trim() !== '') {
            const ast = template.expression(`${state.intlName}.formatMessage(messages["${path.node.value}"])`)()

            path.replaceWith(jsxExpressionContainer(ast));
        }
      }
    },
  };
}

const ast = parser.parse(sourceCode, {
  sourceType: "module",
  plugins: ["jsx"],
});

const res = transformFromAstSync(ast, sourceCode, {
  plugins: [myPlugin],
  retainLines: true,
});

(async function () {
  const formatedCode = await prettier.format(res?.code, {
    filepath: "a.tsx",
  });

  console.log(formatedCode);
})();
