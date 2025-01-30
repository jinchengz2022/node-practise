import url from 'node:url'

const myURL = new url.URL('https://user:pass@sub.example.com:8000/jin/c/?a=lucy&b=motonony#hashhash')

console.log('myURL.hash', myURL.hash);
console.log('myURL.host', myURL.host);
console.log('myURL.searchParams', myURL.searchParams);
console.log('urlToHttpOptions', url.urlToHttpOptions(myURL));

myURL.searchParams.set('c', 'jack');
myURL.searchParams.append('d', 'test');

console.log('myURL.searchParams.toString()', myURL.searchParams.toString());