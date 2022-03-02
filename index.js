const readline = require('readline');
const chalk = require("chalk");
const fs = require('fs');
var todoTitle = "";
var todoSubject = "";

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

printStartProgramme();
createJsonFileIfDontExist();




rl.on('line', (argument) => {
    console.log("");
    const listArgument = argument.split(" ");

    switch(listArgument[0]) {
      
        case "add":
          askForTitle();
          break;

        case "info":
          printAddDetails();
          printRemoveDetails();
          printListeDetails();
          break;
        
        case "list":
          listAllTodoInJson();
          break;
        
        case "remove":
          askForTitleToRemove();
          break;

        case "exit":
          rl.close();
          break;

        default:
        console.log(chalk.red('Commande not found, type info for more information'));
      }
});


function askForTitle() {
  return new Promise((resolve, reject) => {
    rl.question('enter a title: ',(arr)=>{
      todoTitle = arr;
      resolve();
      askForSubject();
    });
  })
}

function askForSubject() {
  return new Promise((resolve, reject) => {
    rl.question('enter a subject: ',(arr)=>{
      todoSubject = arr;
      resolve();
      pushDataToJsonFile();
    });
  })
}

function pushDataToJsonFile() {
  fs.readFile('data.json','utf8', function readFileCallback(err, dataFromJson){
    if (err){
        console.log(err);
    } else {
      todoList = JSON.parse(dataFromJson); 
      todoList.push({"title": todoTitle, "subject": todoSubject}); 
      json = JSON.stringify(todoList);

      fs.writeFile("data.json", json, (err) => {
        if (err)
          console.log( chalk.red("something went wrong, please try again."));
        else {
          console.log();
          console.log(chalk.green("Todo has been added successfully ✔\n"));
        }
      });
  }});
}

function listAllTodoInJson() {
  fs.readFile('data.json','utf8', function readFileCallback(err, data){
    if (err){
        console.log(err);
    } else {
      todoList = JSON.parse(data);
      if(todoList.length == 0) {
        console.log(chalk.yellow("There is no Todo in the list"));
        console.log();
      }
      else {
        for (var i = 0; i < todoList.length; i ++) {
          console.log("Todo n°", i);
          console.log("");
          console.log(chalk.blue("Title: ", todoList[i].title));
          console.log(chalk.green("Subject: ", todoList[i].subject));
          console.log("----------------------------");
        }
      }
  }});
}

function removeTodo(arr) {
  fs.readFile('data.json','utf8', function readFileCallback(err, data){
    if (err){
        console.log(err);
    } else {
      todoList = JSON.parse(data); 
      for (var i = 0; i < todoList.length; i ++) {
        if(todoList[i].title == arr) {
          todoList.splice(i);
          break;
        }
      }
      json = JSON.stringify(todoList);
      fs.writeFile("data.json", json, (err) => {
        if (err)
          console.log(err);
        else {
          console.log();
          console.log(chalk.red("Todo has benn removed successfully ✔\n"));
        }
      });
  }});
}


function askForTitleToRemove() {
  return new Promise((resolve, reject) => {
    rl.question('enter the subject of the todo you want to delete: ',(arr)=>{ 
    removeTodo(arr);
    resolve();
    });
  })
}

function printAddDetails(){
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

function printRemoveDetails(){
  console.log("----------------------------------");
  console.log(chalk.yellow("How to remove a todo: "))
  console.log();
  console.log(("1- write: remove"));
  console.log(("2- enter the title of your todo that you want to remove and press Enter"));
  console.log();
  console.log(chalk.green("Well done! you have juste removed your todo!"));
  console.log("----------------------------------");
}

function printListeDetails(){
  console.log("----------------------------------");
  console.log(chalk.yellow("How to print the list of todos: "))
  console.log();
  console.log(("1- write: list"));
  console.log();
  console.log(chalk.green("Well done! you have juste printed all your todos!"));
  console.log("----------------------------------");
}


function printStartProgramme(){
  console.log(chalk.green("/********* Welcome to MY_TODO *********/"));
  console.log("");
  console.log("----------------------------------")
  console.log(chalk.cyanBright("type info for details."));
  console.log(chalk.cyanBright("type add to add new todo"));
  console.log(chalk.cyanBright("type remove to delete a todo"));
  console.log(chalk.cyanBright("type list to print all available todos"));
  console.log("----------------------------------")
}

function createJsonFileIfDontExist() {
  // the 'a' parametre will check if the file already existe, if not it will create one
  fs.closeSync(fs.openSync("./data.json", 'a'));
}

//event handle at close
rl.on('close', function () {
    console.log(chalk.yellow("Thank you for using MY_TODO !"));
    process.exit(0);
});

