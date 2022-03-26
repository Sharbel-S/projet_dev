"use strict"

const { MongoClient, ServerApiVersion, Db } = require('mongodb');
const uri = "mongodb+srv://shs:Methode123@cluster0.bude8.mongodb.net/accountExist?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
var dbo = client.db("Todos");


exports.check_email_password_account = async function (email, password) {
    await client.connect();
    var rep = await dbo.collection("accounts").findOne({ "email": email, "password": password });
    client.close();
    if (rep != null) return rep._id.toString();
    return null;
}

exports.check_if_email_already_used = async function (email) {
    var emailAlreadyUsed = false;
    await client.connect();
    var rep = await dbo.collection("accounts").findOne({ "email": email });
    if (rep != null) emailAlreadyUsed = true;
    return emailAlreadyUsed;
}

exports.create_new_account = async function (email, password) {
    await client.connect();
    var rep = await dbo.collection("accounts").insertOne({ "email": email, "password": password });
    console.log(rep);
    if (rep != null) return rep.insertedId.toString();
    return null;
}

