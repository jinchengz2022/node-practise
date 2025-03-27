import parser from "@babel/parser";
import traverser from "@babel/traverse";
import fs from "fs";
import { glob } from "glob";
import _ from "lodash";
import path from "path";
import pify from "pify";
import { traverseDirectoryAsync } from './replace'
// import tencentCloud from 'tencentcloud-sdk-nodejs';

// esm模式的node环境不支持__dirname了所以写了一下这个
// const __dirname = import.meta.url.match(/(\/[^\/]+)+(?=\/)/)?.[0];

const supportedLocales = ["zh", "en", "ja", "zh-TW"];

const resolveChineseWordsFromTSX = (path) =>
  new Promise((resolve, reject) => {
    fs.readFile(path, "utf-8", (err, data) => {
      const hasChinese = (str) => /\p{sc=Han}/gu.test(str);
      const ast = parser.parse(data, {
        plugins: ["jsx", "typescript"],
        sourceType: "module",
      });
      const traverse = traverser.default;
      const words = [];
      traverse(ast, {
        enter(path) {
          // 这边用t.isStringLiteral()和t.isJSXText()进行判断也行
          if (
            path.node.type !== "StringLiteral" &&
            path.node.type !== "JSXText"
          )
            return;
          const value = path.node.value
            ?.replace(/^[\n ]+/, "")
            ?.replace(/[\n ]+$/, ""); // JSXText往往有一些/n      /t       会让文案长度增加，不利于节省流量
          if (!hasChinese(value)) return;
          words.push(value);
        },
      });
      resolve(words);
    });
  });

async function scan(path) {
  // glob.glob(path.resolve(__dirname, "../**/*.{ts,tsx}"), async (err, matches) => {

  // 初始化翻译SDK，你可以换成任何一个能翻译的接口
  //   const tmtClient = tencentCloud.tmt.v20180321.Client;
  //   const client = new tmtClient({
  //     credential: {
  //       secretId: '',
  //       secretKey: '',
  //     },
  //     region: 'ap-shanghai',
  //   });

  const chineseWords = [];

  // for (const match of matches) {
  const words = await resolveChineseWordsFromTSX(path);
  chineseWords.push(...words);
  // }

  const uniqChineseWords = _.uniq(chineseWords);
  // 这里可以用pify直接promisify，但是当时忘记用了。。
  //   const translate = (list, target) =>
  //     new Promise((resolve, reject) => {
  //       client.TextTranslateBatch(
  //         {
  //           SourceTextList: list,
  //           Source: 'zh',
  //           Target: target,
  //           ProjectId: 0,
  //         },
  //         (err, resp) => {
  //           if (err) return reject(err);
  //           resolve(resp?.TargetTextList);
  //         }
  //       );
  //     });
  const needToTranslate = [];
  let jsonObject = {};

  // ['a', 'b'] -> {a: a, b: b}
  const jsonZH = _.zipObject(uniqChineseWords, uniqChineseWords);
  const json = await pify(fs.readFile)("./transform.json", "utf-8");
  jsonObject = JSON.parse(json);

  // 找出新增字段
  needToTranslate.push(...Object.keys(_.omit(jsonZH, Object.keys(jsonObject))));

  if (!needToTranslate.length) {
    return;
  }

  // const translationResult = await translate(needToTranslate, locale);
  const newTranslationObject = _.zipObject(needToTranslate, needToTranslate); //translationResult);

  // 合并所有文本信息
  const localeJson = { ...jsonObject, ...newTranslationObject };
  const sortedLocaleJson = {};
  // 咳咳，这边做了一下排序，是为了方便后续的优化
  // 目前在外语环境下依然会用中文作为key，如果所有文案的顺序保持一致，未来可以用index作为key，节省空间
  Object.keys(jsonZH).forEach(
    (key) => (sortedLocaleJson[key] = localeJson[key])
  );

  fs.writeFileSync(
    "./transform.json",
    JSON.stringify(sortedLocaleJson),
    "utf-8"
  );

  //       for (const  locale of supportedLocales) {
  //     const localeJsonPath = path.resolve(__dirname, '../locales/' + locale + '.json');
  //     if (locale === 'zh') {
  //       fs.writeFileSync(localeJsonPath, JSON.stringify(jsonZH));
  //       continue;
  //     }

  //     // 尝试读取已有的[locale].json文件，只新翻译当前没有的文案
  //     // 因为调用接口会花钱，全量翻译成本贵。而且只翻译增量文案也能不变动老文案上可能人为修改过的内容
  //     const needToTranslate = [];
  //     let jsonObject = {};
  //     if (fs.existsSync(localeJsonPath)) {
  //       const json = await pify(fs.readFile)(localeJsonPath, 'utf-8');
  //       jsonObject = JSON.parse(json);
  //       needToTranslate.push(...Object.keys(_.omit(jsonZH, Object.keys(jsonObject))));
  //     } else {
  //       needToTranslate.push(...Object.keys(jsonZH));
  //     }

  //     if (!needToTranslate.length) continue;

  //     // const translationResult = await translate(needToTranslate, locale);
  //     const newTranslationObject = _.zipObject(needToTranslate, needToTranslate)//translationResult);
  //     const localeJson = { ...jsonObject, ...newTranslationObject };
  //     const sortedLocaleJson = {};
  //     // 咳咳，这边做了一下排序，是为了方便后续的优化
  //     // 目前在外语环境下依然会用中文作为key，如果所有文案的顺序保持一致，未来可以用index作为key，节省空间
  //     Object.keys(jsonZH).forEach((key) => (sortedLocaleJson[key] = localeJson[key]));

  //     fs.writeFileSync(localeJsonPath, JSON.stringify(sortedLocaleJson), 'utf-8');
  //   }
  // });
}

traverseDirectoryAsync('./main', scan)
