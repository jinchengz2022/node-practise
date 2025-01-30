import url from 'node:url';

console.log('import.meta.dirname', import.meta.dirname);

console.log('import.meta.filename', import.meta.filename);

console.log('import.meta.url', import.meta.url);

console.log('url.fileURLToPath === import.meta.url', url.fileURLToPath(import.meta.url));
