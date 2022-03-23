"use strict"
const chalk = require("chalk");
var controler = require('./controler.js');
var todoTitle = "";
var todoSubject = "";
var todoNewTitle = "";
var todoEmail = "";
var todoPassword = "";

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

  exports.askForTitle = function(rl) {
    return new Promise((resolve, reject) => {
      rl.question('enter a title: ', (arr) => {
        todoTitle = arr;
        resolve();
        askForSubject(rl);
      });
    })
  }
  
  
  function askForSubject(rl) {
    return new Promise((resolve, reject) => {
      rl.question('enter a subject: ', (inputSubject) => {
        todoSubject = inputSubject;
        resolve();
        controler.addDataToDataBase(todoTitle,todoSubject);
      });
    })
  }
  

  exports.askForModify = function(rl) {
    rl.question('enter the title: ', (title) => {
      todoTitle = title;
  
      rl.question('enter the new title: ', (Newtitle) => {
        todoNewTitle = Newtitle;
        controler.test2(todoTitle, todoNewTitle);
      })
    });
  }
  
  
 exports.askForSignup = function(rl) {
    return new Promise((resolve, reject) => {
      rl.question('enter an email: ', (email) => {
        todoEmail = email;
        resolve();
        askForPassword(rl);
      });
    })
  }
  
  function askForPassword(rl) {
    return new Promise((resolve, reject) => {
      rl.question('enter a password: ', (Password) => {
        todoPassword = Password;
        resolve();
        controler.addNewAccountToDataBase(todoEmail, todoPassword);
      });
    })
  }
  