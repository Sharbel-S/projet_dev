"use strict"

const { MongoClient, ServerApiVersion, Db } = require('mongodb');
const uri = "mongodb+srv://shs:Methode123@cluster0.bude8.mongodb.net/accountExist?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
var dbo = client.db("Todos");


exports.getTodoList = async function () {
    await client.connect();
    var rep = await dbo.collection("tasks").find({}).toArray();
    client.close();
    return rep;
}

exports.insert_new_todo = async function (title, date, details, group) {
    await client.connect();
    await dbo.collection("tasks").updateOne({ "group": group }, {
        $push: {
            "tasks": {
                "title": title,
                "date": date,
                "status": "todo",
                "details": details
            }
        }
    }, { upsert: true });

    client.close();
}


exports.get_all_groups_for_user = async function (userEmail) {
    await client.connect();
    var rep = await dbo.collection("tasks_groups").find({ "email": userEmail }).project({ "group": 1 ,"color":1, "_id": 0 }).toArray();
    client.close();
    return rep;
}

exports.get_all_tasks_of_group = async function (groupId) {
    await client.connect();
    var rep = await dbo.collection("tasks").find({"group": groupId }).toArray();
    client.close();
    return rep;
}


exports.delete_selected_todo = async function (id) {
    await client.connect();
    var rep = await dbo.collection("tasks").deleteOne({ "_id": id});
    console.log(rep);
    client.close();
}