import ansi from 'ansi-escapes'

const log = process.stdout.write.bind(process.stdout);

log(ansi.cursorTo(10, 2) + 'jincheng')
log(ansi.cursorTo(18, 5) + 'hello')