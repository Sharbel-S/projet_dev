"use strict"
const { MongoClient, ServerApiVersion, Db } = require('mongodb');
const uri = "mongodb+srv://shs:Methode123@cluster0.bude8.mongodb.net/test?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
var dbo = client.db("Todos");
const chalk = require("chalk");


exports.addDataToDataBase = function(todoTitle,todoSubject) {
    client.connect(err => {
      var newData = { "title": todoTitle, "subject": todoSubject };
      dbo.collection("TodoList").insertOne(newData, function (err, res) {
        if (err) throw err;
        console.log("1 document inserted");
        client.close();
      });
    });
  }

exports.test2 = function(todoTitle, todoNewTitle) {
    client.connect(err => {
    dbo.collection("TodoList").replaceOne(
      { "title": todoTitle },
      { "title": todoNewTitle }
      , function (err) {
        if (err) {
          console.log(chalk.red("something went wrong, please try again."));
        } else {
          console.log();
          console.log(chalk.green("Todo has been modified successfully ✔\n"));
        }
        client.close();
      })
  });
}

exports.addNewAccountToDataBase = function(todoEmail, todoPassword) {
    client.connect(err => {
      dbo.collection("accounts").insertOne({ "email": todoEmail, "password": todoPassword }, function (err, res) {
        if (err) throw err;
        console.log("Account created successfully");
        client.close();
      });
    });
  }