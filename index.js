const { MongoClient, ServerApiVersion, Db } = require('mongodb');
const uri = "mongodb+srv://shs:Methode123@cluster0.bude8.mongodb.net/test?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
var dbo = client.db("Todos");
const readline = require('readline');
const chalk = require("chalk");

const fs = require('fs');
var todoTitle = "";
var todoSubject = "";
var todoEmail = "";
var todoPassword = "";
var todoNewTitle = "";

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
          //listAllTodoInJson();
          listAllTodoInDataBase();
          break;
        
        case "remove":
          askForTitleToRemove();
          break;

        case "signin":
          askForLog();
          break;

        case "exit":
          rl.close();
          break;
        
        case "modify":
          askForModify();
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
    rl.question('enter a subject: ',(inputSubject)=>{
      todoSubject = inputSubject;
      resolve();
      pushDataToJsonFile();
      addDataToDataBase();
    });
  })
}

function askForModify() {
  rl.question('enter the title: ',(title)=>{
    todoTitle = title;
  
    rl.question('enter the new title: ',(Newtitle)=>{
      todoNewTitle = Newtitle;  
      client.connect(err => {
  dbo.collection("TodoList").replaceOne(
    {"title": todoTitle},
    {"title": todoNewTitle }
  )
  //commentaire à afficher
    }); 
  });
});

}

function askForLog()
{
  return new Promise((resolve, reject) => {
    rl.question('enter an email: ',(email)=>{
      todoEmail = email;
      resolve();
      askForPassword();
    });
  })
}

function askForPassword() {
  return new Promise((resolve, reject) => {
    rl.question('enter a password: ',(Password)=>{
      todoPassword = Password;
      resolve();
      // pushDataToJsonFile();
      addDataToDataBase();
    });
  })
}

function addDataToDataBase() {
  client.connect(err => {
    var newData = {"title": todoTitle, "subject":todoSubject};
    dbo.collection("TodoList").insertOne(newData, function(err, res) {
      if (err) throw err;
      console.log("1 document inserted");
      client.close();
    });
  });
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
          console.log(chalk.red("something went wrong, please try again."));
        else {
          console.log();
          console.log(chalk.green("Todo has been added successfully ✔\n"));
        }
      });
  }});
}

function listAllTodoInDataBase() {
  client.connect(err => {
    dbo.collection("TodoList").find({}).toArray(function (err, result) {
      if (err) {
          console.log(err);
      } else {
        console.log(result);
      }
    })
  });
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
          console.log("----------------------------");
          console.log("Todo n°", i);
          console.log("");
          console.log(chalk.blue("Title: ", todoList[i].title));
          console.log(chalk.green("Subject: ", todoList[i].subject));
        }
        console.log("----------------------------");
      }
  }});
}

function removeTodo(title){

  client.connect(err => {
    var todo = {"title": title};
    dbo.collection("TodoList").deleteOne(todo, function(err, res) {
      if (err) throw err;
      console.log("1 document deleted");
      client.close();
    });
  });
  // fs.readFile('data.json','utf8', function readFileCallback(err, data){
  //   if (err){
  //       console.log(err);
  //   } else {
  //     todoList = JSON.parse(data);
  //     titleInList = checkIfTitleInList(todoList, title);
  //     if(!titleInList) {
  //       console.log(chalk.red("Title not found !"));
  //     }
  //     else {
  //       json = JSON.stringify(todoList);
  //       fs.writeFile("data.json", json, (err) => {
  //         if (err)
  //           console.log(err);
  //         else {
  //           console.log();
  //           console.log(chalk.red("Todo has benn removed successfully ✔\n"));
  //         }
  //       });
  //     }
  // }});
}

function checkIfTitleInList(todoList, arr) {
  var titleInList = 0;
  for (var i = 0; i < todoList.length; i ++) {
    if(todoList[i].title == arr) {
      titleInList = 1;
      todoList.splice(i);
      break;
    }
  }
  return titleInList;
}

function askForTitleToRemove() {
  return new Promise((resolve, reject) => {
    rl.question('enter the title of the todo you want to delete: ',(title)=>{ 
    removeTodoFromDataBase(title);
    removeTodo(title);
    resolve();
    });
  })
}

function removeTodoFromDataBase(title) {
  client.connect(err => {
    var dataToRemove = {"title": title};
    dbo.collection("TodoList").deleteOne(dataToRemove, function(err, res) {
      if (err) throw err;
      console.log("1 document removed");
      client.close();
    });
  });
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
  console.log(chalk.cyanBright("type modify to change a todo"));
  console.log(chalk.cyanBright("type remove to delete a todo"));
  console.log(chalk.cyanBright("type signin to create an account"));
  console.log(chalk.cyanBright("type list to print all available todos"));
  console.log(chalk.cyanBright("type exit to close the application"));
  console.log("----------------------------------")
}

function createJsonFileIfDontExist() {
  // the 'a' parametre will check if the file already existe, if not it will create one
  fs.closeSync(fs.openSync("./data.json", 'a'));
  addEmptyArrayToEmptyJson();
}

function addEmptyArrayToEmptyJson() {
  fs.readFile('data.json','utf8', function readFileCallback(err, data){
    if(data == "") {
      fs.writeFile ("data.json", JSON.stringify([]), function() {
        }
      );
    }
  });
}


//event handle at close
rl.on('close', function () {
    console.log(chalk.yellow("Thank you for using MY_TODO !"));
    process.exit(0);
});




