import generator from "@babel/generator";
import parser from "@babel/parser";
import traverser from "@babel/traverse";
import t from "@babel/types";
import fs from "fs";
// import glob from 'glob';
import path from "path";
import pify from "pify";

// 用正则判断一下是不是中文内容
const hasChinese = (str) => /\p{sc=Han}/gu.test(str);

// 判断当前代码已经被替换过的规则是当前节点的父节点是一个函数调用，并且调用的函数是t
const needToReplace = (path) => {
  const parentNode = path.parentPath?.node;
  if (t.isCallExpression(parentNode) && parentNode?.callee?.name === "t") {
    return false;
  }
  return true;
};

const replaceStringLiteralToI18nCallExpression = async (path) => {
  const code = await pify(fs.readFile)(path, "utf-8");
  
  // 解析为 ast 树
  const ast = parser.parse(code, {
    plugins: ["jsx", "typescript"],
    sourceType: "module",
  });
  const traverse = traverser.default;

  const resolvedChineseWords = [];
  let firstImportDeclarationPath;
  let needToInsertImportDeclaration = true;

  // 遍历 ast 内容
  traverse(ast, {
    enter(path) {
      const node = path.node;
      if (!needToReplace(path)) return;

      const nodeType = node.type;

      // 如果是这两种类型才能进行替换
      const supportedNodeType = ["StringLiteral", "JSXText"];
      if (!supportedNodeType.includes(nodeType)) return;

      // 会有 '     /n' 的情况
      const nodeValue = path.node.value
        ?.replace(/^[\n ]+/, "")
        ?.replace(/[\n ]+$/, "");
      if (!hasChinese(nodeValue)) return;

      resolvedChineseWords.push(nodeValue);

      const parentNode = path.parentPath.node;
      const parentType = parentNode.type;

      // 生成表达式
      const tCallExpression = t.callExpression(t.identifier("t"), [
        t.stringLiteral(nodeValue),
      ]);
      switch (parentType) {
        case "JSXElement":
        case "JSXAttribute":
        case "JSXText": {
          // 在JSX里面的内容因为需要{}来包裹变量，因此需要将函数调用放入JSXExpressionContainer中
          path.replaceWith(t.JSXExpressionContainer(tCallExpression));
          break;
        }
        default: {
          path.replaceWith(tCallExpression);
          break;
        }
      }
    },
    ImportDeclaration(path) {
      if (!firstImportDeclarationPath) firstImportDeclarationPath = path;

      const node = path.node;
      const sourceValue = node.source.value;
      const specifiers = node.specifiers;

      // 引入包名是否是 i18next 且导入变量存在 t
      if (sourceValue === "i18next") {
        for (let specifier of specifiers) {
          if (t.isImportSpecifier(specifier)) {
            if (specifier?.imported?.name === "t") {
              needToInsertImportDeclaration = false;
              return;
            }
          }
        }
      }
    },
  });

  // 没有文本需要替换
  if (!resolvedChineseWords.length) return;

  // 需要插入导入的代码语句
  if (needToInsertImportDeclaration) {
    const importDeclaration = t.importDeclaration(
      [t.importSpecifier(t.identifier("t"), t.identifier("t"))],
      t.stringLiteral("i18next")
    );
    firstImportDeclarationPath.insertBefore(importDeclaration);
  }

  // 我这边用了esm的node，但是babel那边的export是cjs格式的，蛮奇怪嘻嘻
  // 所以得加一个暂时default解决下问题
  const generate = generator.default;
  fs.writeFileSync(
    path,
    generate(ast, { jsescOption: { minimal: true } }, code).code,
    "utf-8"
  );
};

// const __dirname = import.meta.url.match(/(\/[^\/]+)+(?=\/)/)?.[0];

// glob(path.resolve(__dirname, '../{pages,components}/**/*.{ts,tsx}'), (err, matches) => {
//   matches.forEach(replaceStringLiteralToI18nCallExpression);
// });


export async function traverseDirectoryAsync(dir, func) {
  try {
    // 读取目录下的所有文件和子目录
    const files = await fs.promises.readdir(dir);
    for (const file of files) {
      const filePath = path.join(dir, file);
      const stats = await fs.promises.stat(filePath);
      if (file === "node_modules") {
        continue;
      }
      if (stats.isDirectory()) {
        // 如果是目录，递归调用该函数处理子目录
        await traverseDirectoryAsync(filePath);
      } else {
        // 如果是文件，读取文件内容
        func(filePath);
      }
    }
  } catch (err) {
    console.error("Error traversing directory:", err);
  }
}

traverseDirectoryAsync('./main', replaceStringLiteralToI18nCallExpression)
