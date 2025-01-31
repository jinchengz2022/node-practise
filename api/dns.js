// 查询域名对应 ip
import dns from 'node:dns/promises'

const main = async () => {
    const res = await dns.resolve('baidu.com')

    console.log({res});
}

main();