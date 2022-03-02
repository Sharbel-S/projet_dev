const readline = require('readline');
const chalk = require("chalk");
const fs = require('fs');
var todoTitle = "";
var todoSubject = "";
var my_todo = {};
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
    });
})
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
        
        case "add":
          if(listArgument.length != 3) {
            console.log(chalk.red("To add new Todo, please respecte the following example :"));
            console.log(chalk.yellow("add , argument1, argument2"));
          }
          else {
            fs.readFile('data.json','utf8', function readFileCallback(err, data){
              if (err){
                  console.log(err);
              } else {
                console.log(" data  : ", data);
              obj = JSON.parse(data); //now it an object
              obj.table.push({id: 2, square:3}); //add some data
              json = JSON.stringify(obj); //convert it back to json
              fs.writeFile('data.json', json, 'utf8', callback); // write it back 
          }});
          }
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

