const readline = require('readline');
const chalk = require("chalk");

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});


console.log("/********* Welcome to MY_TODO *********/");
console.log(chalk.yellow("type info to list commandes"));


rl.on('line', (commande) => {

    switch(commande) {

        case "info":
          printAvailableCommandes()
          break;

        case "exit":
            rl.close();
            break;

        default:
        console.log('Commande not found, type info for more information');

      }
});




//event handle at close

rl.on('close', function () {
    console.log(chalk.yellow("Thank you for using MY_TODO !"));
    process.exit(0);
});

