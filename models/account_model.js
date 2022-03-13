"use strict"

const { MongoClient, ServerApiVersion, Db } = require('mongodb');
const uri = "mongodb+srv://shs:Methode123@cluster0.bude8.mongodb.net/accountExist?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
var dbo = client.db("Todos");




exports.check_email_password_account = async function (email, password) {
    var accountExist = false;
    await client.connect();
    var rep = await dbo.collection("accounts").findOne({ "email": email, "password": password });
    if (rep != null) accountExist = true;
    client.close();
    return accountExist;
}

