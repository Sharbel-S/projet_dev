var view = require('./view');
var controler = require('./controler');
const readline = require('readline');
const chalk = require("chalk");


const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});


view.printStartProgramme();


rl.on('line', (argument) => {
  console.log("");
  const listArgument = argument.split(" ");

  switch (listArgument[0]) {

    case "add":
      view.askForAddTheTitle(rl);
      break;

    case "info":
      view.printAddDetails();
      view.printRemoveDetails();
      view.printListeDetails();
      break;

    case "list":
      //listAllTodoInJson();
      controler.listAllTodoInDataBase();
      break;

    case "remove":
      view.askForTitleToRemove(rl);
      break;

    case "signup":
      view.askForEmailToSignUp(rl);
      break;

    case "login":
      view.askForEmailToLogin(rl);
      break;

    case "exit":
      rl.close();
      break;

    case "modify":
      view.askForColumnToModify(rl);
      break;

    case "group":
      view.askForGroup(rl);
      break;

    default:
      console.log(chalk.red('Commande not found, type info for more information'));
  }
});

//event handle at close
rl.on('close', function () {
  console.log(chalk.yellow("Thank you for using MY_TODO !"));
  process.exit(0);
});



