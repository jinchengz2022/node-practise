import chalk from "chalk";

console.log(chalk.blueBright('hello') + chalk.blueBright('judy'));

console.log(`
    CPU: ${chalk.rgb(25,33,100).bold('bold')}
    RAM: ${chalk.hex('#2566c2').underline('underline')}
    DISK: ${chalk.yellow('70%')}
`);