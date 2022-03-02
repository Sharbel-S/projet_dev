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
  fs.readFile('data.json','utf8', function readFileCallback(err, data){
    if (err){
        console.log(err);
    } else {
      obj = JSON.parse(data); 
      obj.push({"title": todoTitle, "subject": todoSubject}); 
      json = JSON.stringify(obj);

      fs.writeFile("data.json", json, (err) => {
        if (err)
          console.log(err);
        else {
          console.log("Todo written successfully\n");
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
      for (var i = 0; i < todoList.length; i ++) {
        console.log("Todo n°", i);
        console.log("");
        console.log(chalk.blue("Title: ", todoList[i].title));
        console.log(chalk.green("Subject: ", todoList[i].subject));
        console.log("----------------------------");
      }
  }});

}


rl.on('line', (argument) => {
    console.log("");
    const listArgument = argument.split(" ");

    switch(listArgument[0]) {
      
        case "add":
          askForTitle();
          break;

        case "info":
          printAddDetails();
          console.log("subj = ", todoSubject);
          console.log("title = ", todoTitle);
          break;
        
        case "list":
          listAllTodoInJson();
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
  // the 'a' parametre will check if the file already existe, if not it will create one
  fs.closeSync(fs.openSync("./data.json", 'a'));
}

createJsonFileIfDontExist();

//event handle at close

rl.on('close', function () {
    console.log(chalk.yellow("Thank you for using MY_TODO !"));
    process.exit(0);
});

