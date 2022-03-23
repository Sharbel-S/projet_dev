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