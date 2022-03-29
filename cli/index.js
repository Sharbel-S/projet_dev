var view = require('./view');
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

    case "addtodo":
      view.askForTitleToAddNewTodo(rl);
      break;

    case "info":
      view.printAddDetails();
      view.printRemoveDetails();
      view.printListeDetails();
      break;

    case "listgroup":
      view.printAllGroups();
      break;

    case "remove":
      view.askForTitleToRemove(rl);
      break;

    case "signup":
      view.askForEmailToSignUp(rl);
      break;

    case "signin":
      view.askForEmailToSignIn(rl);
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

    case "signout":
      view.signOut();
      break;

    case "addgroup":
      view.askForNameForNewGroup(rl);
      break;

    case "removegroup":
      view.askForGroupNameToRemove(rl);
      break;

    case "listtask":
      view.printAllTasksOfGroup();
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



