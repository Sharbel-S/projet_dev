"use strict"
const chalk = require("chalk");

exports.printStartProgramme = function(){
    console.log(chalk.green("/********* Welcome to MY_TODO *********/"));
    console.log("");
    console.log("----------------------------------")
    console.log(chalk.cyanBright("type info for details."));
    console.log(chalk.cyanBright("type add to add new todo"));
    console.log(chalk.cyanBright("type modify to change a todo"));
    console.log(chalk.cyanBright("type remove to delete a todo"));
    console.log(chalk.cyanBright("type signup to create an account"));
    console.log(chalk.cyanBright("type login to log to your account"));
    console.log(chalk.cyanBright("type list to print all available todos"));
    console.log(chalk.cyanBright("type exit to close the application"));
    console.log("----------------------------------")
}

exports.printAddDetails = function() {
    console.log("----------------------------------");
    console.log(chalk.yellow("How to add new todo: "))
    console.log();
    console.log(("1- write: add"));
    console.log(("2- enter the title of your todo and press Enter"));
    console.log(("3- enter the subject of your todo and press Enter"));
    console.log();
    console.log(chalk.green("Well done! you have juste added a new todo to your list !"));
    console.log("----------------------------------");
  }
  
  exports.printRemoveDetails = function() {
    console.log("----------------------------------");
    console.log(chalk.yellow("How to remove a todo: "))
    console.log();
    console.log(("1- write: remove"));
    console.log(("2- enter the title of your todo that you want to remove and press Enter"));
    console.log();
    console.log(chalk.green("Well done! you have juste removed your todo!"));
    console.log("----------------------------------");
  }
  
 exports.printListeDetails = function() {
    console.log("----------------------------------");
    console.log(chalk.yellow("How to print the list of todos: "))
    console.log();
    console.log(("1- write: list"));
    console.log();
    console.log(chalk.green("Well done! you have juste printed all your todos!"));
    console.log("----------------------------------");
  }