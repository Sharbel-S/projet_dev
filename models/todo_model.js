"use strict"

const { MongoClient, ServerApiVersion, Db } = require('mongodb');
const uri = "mongodb+srv://shs:Methode123@cluster0.bude8.mongodb.net/accountExist?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
var dbo = client.db("Todos");
var today = new Date();
var date = today.getFullYear() + '-' + (today.getMonth() + 1) + +  '-' + today.getDate();
var mongodb = require('mongodb');


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
    var rep = await dbo.collection("tasks_groups").find({ "userId": userEmail }).project({ "group": 1, "color": 1, "creationDate": 1, "_id": 1 }).toArray();
    client.close();
    return rep;
}

exports.get_all_tasks_of_group = async function (groupId) {
    await client.connect();
    var rep = await dbo.collection("tasks").find({ "groupId": groupId }).toArray();
    client.close();
    return rep;
}


exports.delete_selected_todo = async function (id) {
    await client.connect();
    var rep = await dbo.collection("tasks").deleteOne({ "_id": id });
    client.close();
}

exports.change_todo_title = async function () {
}

exports.add_new_todo_group = async function (userId, groupName, groupColor) {
    await client.connect();
    var rep = await dbo.collection("tasks_groups").insertOne({ "userId": userId, "group": groupName, "color": groupColor, "creationDate": date });
    client.close();
    return rep;
}

exports.delete_selected_todo_group = async function (groupId) {
    await client.connect();
    var rep = await dbo.collection("tasks_groups").deleteOne({ _id: new mongodb.ObjectID(groupId) });
    client.close();
    return rep;
}

exports.delete_selected_todo = async function (taskId) {
    await client.connect();
    var rep = await dbo.collection("tasks").deleteOne({ _id: new mongodb.ObjectID(taskId) });
    client.close();
    return rep;
}

exports.get_group_info = async function (groupId) {
    await client.connect();
    var rep = await dbo.collection("tasks_groups").find({ _id: new mongodb.ObjectID(groupId) }).toArray();
    client.close();
    return rep;
}

exports.edit_todo_group_info = async function (groupId, groupName, groupColor) {
    await client.connect();
    var rep = await dbo.collection("tasks_groups").updateOne({ _id: new mongodb.ObjectID(groupId) }, { $set: { "group": groupName, "color": groupColor } });
    client.close();
    return rep;
}

exports.edit_todo_info = async function (taskId, newTitle, newDescription, newDate) {
    await client.connect();
    var rep = await dbo.collection("tasks").updateOne({ _id: new mongodb.ObjectID(taskId) }, { $set: { "title": newTitle, "limited_date": newDate, "description": newDescription } });
    client.close();
    return rep;
}

exports.set_todo_status_to_todo = async function(taskId) {
    await client.connect();
    var rep = await dbo.collection("tasks").updateOne({ _id: new mongodb.ObjectID(taskId) }, { $set: { "status": "todo"} });
    client.close();
    return rep;
}

exports.set_todo_status_to_done = async function(taskId) {
    await client.connect();
    var rep = await dbo.collection("tasks").updateOne({ _id: new mongodb.ObjectID(taskId) }, { $set: { "status": "checked"} });
    client.close();
    return rep;
}