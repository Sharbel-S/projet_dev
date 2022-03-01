const readline = require('readline');
const chalk = require("chalk");
const fs = require('fs');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

printStartProgramme();


rl.on('line', (argument) => {
    console.log("");
    const listArgument = argument.split(" ");

    switch(listArgument[0]) {

        case "info":
          printAddDetails();
          break;
        
        case "add":

          break;
      
        case "exit":
            rl.close();
            break;

        default:
        console.log(chalk.red('Commande not found, type info for more information'));
      }
});





function printAddDetails(){
  console.log("To add a new TODO write: add argument1 argument2");
  console.log("arument1: the name of your TODO");
  console.log("argument2: the content of your TODO");
}

function printStartProgramme(){
  console.log(chalk.red("/********* Welcome to MY_TODO *********/"));
  console.log("");
  console.log(chalk.yellow("type info to list commandes"));
}

function createJsonFileIfDontExist() {
  fs.closeSync(fs.openSync("./dat.json", 'a'));
}

createJsonFileIfDontExist();

//event handle at close

rl.on('close', function () {
    console.log(chalk.yellow("Thank you for using MY_TODO !"));
    process.exit(0);
});

