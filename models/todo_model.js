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

exports.insert_new_todo = async function (email, data) {
    await client.connect();
    await dbo.collection("tasks_groups").updateOne({ "email": email, "group": data.groupSelect }, { $set: {} }, { upsert: true });
    await dbo.collection("tasks").updateOne({ "group": data.groupSelect }, {
        $push: {
            "tasks": {
                "title": data.title,
                "date": data.dateLimit,
                "status": "todo",
                "details": data.description
            }
        }
    }, { upsert: true });

    client.close();
}

exports.get_all_groups_for_user = async function (userEmail) {
    await client.connect();
    var rep = await dbo.collection("tasks_groups").find({ "email": userEmail }).project({ "group": 1, "_id": 0 }).toArray();
    client.close();
    return rep;
}


exports.delete_selected_todo = async function (id) {
    await client.connect();
    var rep = await dbo.collection("tasks").deleteOne({ "_id": id});
    console.log(rep);
    client.close();
}
