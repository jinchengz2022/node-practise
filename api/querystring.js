import queryString from "node:querystring";

const url = "aa=11&bb=22&cc=33";
console.log(queryString.parse(url));

const obj = { name: "jack", age: 10, sex: "female" };
console.log(queryString.stringify(obj));
