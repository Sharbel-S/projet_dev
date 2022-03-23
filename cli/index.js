const { MongoClient, ServerApiVersion, Db } = require('mongodb');
const uri = "mongodb+srv://shs:Methode123@cluster0.bude8.mongodb.net/test?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
var dbo = client.db("Todos");
var view = require('./view');
const readline = require('readline');
const chalk = require("chalk");

const fs = require('fs');
const { exit } = require('process');
var todoEmail = "";
var todoPassword = "";
var emailLog = "";
var passwordLog = "";

var isConnected = true;

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});


createJsonFileIfDontExist();


rl.on('line', (argument) => {
  console.log("");
  const listArgument = argument.split(" ");

  switch (listArgument[0]) {

    case "add":
      if (isConnected) {
        view.askForTitle(rl);
      }
      else {
       console.log(chalk.greenBright("You must login to add"));
      }
      break;

    case "info":
      view.printAddDetails();
      view.printRemoveDetails();
      view.printListeDetails();
      break;

    case "list":
      //listAllTodoInJson();
      listAllTodoInDataBase();
      break;

    case "remove":
      askForTitleToRemove();
      break;

    case "signup":
      askForSignup();
      break;

    case "login":
      askForLogin();
      break;

    case "exit":
      rl.close();
      break;

    case "modify":
      view.askForModify(rl);
      break;

    default:
      console.log(chalk.red('Commande not found, type info for more information'));
  }
});

view.printStartProgramme();


function addNewAccountToDataBase() {
  client.connect(err => {
    dbo.collection("accounts").insertOne({ "email": todoEmail, "password": todoPassword }, function (err, res) {
      if (err) throw err;
      console.log("Account created successfully");
      client.close();
    });
  });
}



function pushDataToJsonFile() {
  fs.readFile('data.json', 'utf8', function readFileCallback(err, dataFromJson) {
    if (err) {
      console.log(err);
    } else {
      todoList = JSON.parse(dataFromJson);
      todoList.push({ "title": todoTitle, "subject": todoSubject });
      json = JSON.stringify(todoList);
      fs.writeFile("data.json", json, (err) => {
        if (err)
          console.log(chalk.red("something went wrong, please try again."));
        else {
          console.log();
          console.log(chalk.green("Todo has been added successfully ✔\n"));
        }
      });
    }
  });
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
  fs.readFile('data.json', 'utf8', function readFileCallback(err, data) {
    if (err) {
      console.log(err);
    } else {
      todoList = JSON.parse(data);
      if (todoList.length == 0) {
        console.log(chalk.yellow("There is no Todo in the list"));
        console.log();
      }
      else {
        for (var i = 0; i < todoList.length; i++) {
          console.log("----------------------------");
          console.log("Todo n°", i);
          console.log("");
          console.log(chalk.blue("Title: ", todoList[i].title));
          console.log(chalk.green("Subject: ", todoList[i].subject));
        }
        console.log("----------------------------");
      }
    }
  });
}


function removeTodo(title) {

  client.connect(err => {
    var todo = { "title": title };
    dbo.collection("TodoList").deleteOne(todo, function (err, res) {
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


function askForTitleToRemove() {
  return new Promise((resolve, reject) => {
    rl.question('enter the title of the todo you want to delete: ', (title) => {
      removeTodoFromDataBase(title);
      removeTodo(title);
      resolve();
    });
  })
}


function removeTodoFromDataBase(title) {
  client.connect(err => {
    var dataToRemove = { "title": title };
    dbo.collection("TodoList").deleteOne(dataToRemove, function (err, res) {
      if (err) throw err;
      console.log("1 document removed");
      client.close();
    });
  });
}



function createJsonFileIfDontExist() {
  // the 'a' parametre will check if the file already existe, if not it will create one
  fs.closeSync(fs.openSync("./data.json", 'a'));
  addEmptyArrayToEmptyJson();
}

function addEmptyArrayToEmptyJson() {
  fs.readFile('data.json', 'utf8', function readFileCallback(err, data) {
    if (data == "") {
      fs.writeFile("data.json", JSON.stringify([]), function () {
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




