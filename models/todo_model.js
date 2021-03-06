"use strict"

const { MongoClient, ServerApiVersion, Db } = require('mongodb');
const uri = "mongodb+srv://shs:Methode123@cluster0.bude8.mongodb.net/accountExist?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
var dbo = client.db("Todos");
var today = new Date();
var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
var mongodb = require('mongodb');




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

exports.get_todo_status = async function (title) {
    await client.connect();
    var rep = await dbo.collection("tasks").findOne({"title" : title});
    client.close();
    return rep;
}

exports.set_todo_status_to_todo = async function (taskId) {
    await client.connect();
    var rep = await dbo.collection("tasks").updateOne({ _id: new mongodb.ObjectID(taskId) }, { $set: { "status": "todo" } });
    client.close();
    return rep;
}

exports.set_todo_status_to_done = async function (taskId) {
    await client.connect();
    var rep = await dbo.collection("tasks").updateOne({ _id: new mongodb.ObjectID(taskId) }, { $set: { "status": "checked" } });
    client.close();
    return rep;
}

exports.add_new_todo = async function (groupId, groupName, newTitle, newDate, newDescription) {
    await client.connect();
    var rep = await dbo.collection("tasks").insertOne({ "groupId": groupId, "groupName": groupName, "title": newTitle, "limited_date": newDate, "description": newDescription, "status": "todo" });
    client.close();
    return rep;
}

exports.check_if_group_exist = async function (groupName) {
    await client.connect();
    var rep = await dbo.collection("tasks_groups").findOne({ "group": groupName });
    client.close();
    return rep;
}

exports.delete_selected_todo_by_name = async function (title, groupSelected, groupSelectedId) {
    await client.connect();
    var rep = await dbo.collection("tasks").deleteOne({ "title": title, "groupName": groupSelected, "groupId": groupSelectedId });
    client.close();
    return rep;
}

exports.delete_selected_group_by_name = async function (idUser, group) {
    await client.connect();
    var rep = await dbo.collection("tasks_groups").deleteOne({ "userId": idUser, "group": group });
    client.close();
    return rep;
}

exports.check_if_title_exist = async function (groupId, title) {
    await client.connect();
    var rep = await dbo.collection("tasks").findOne({ "groupId": groupId, "title": title });
    client.close();
    return rep;
}

exports.modify_actual_title_for_todo = async function (groupId, oldTitle, newTitle) {
    await client.connect();
    var rep = await dbo.collection("tasks").updateOne({ "groupId": groupId, "title": oldTitle }, { $set: { "title": newTitle } });
    client.close();
    return rep;
}

exports.modify_actual_date_for_todo = async function (groupId, title, newDate) {
    await client.connect();
    var rep = await dbo.collection("tasks").updateOne({ "groupId": groupId, "title": title }, { $set: { "limited_date": newDate } });
    client.close();
    return rep;
}

exports.modify_actual_description_for_todo = async function (groupId, title, newDescription) {
    await client.connect();
    var rep = await dbo.collection("tasks").updateOne({ "groupId": groupId, "title": title }, { $set: { "description": newDescription } });
    client.close();
    return rep;
}

exports.get_group_name_by_id = async function (groupId) {
    await client.connect();
    var rep = await dbo.collection("tasks_groups").findOne({ _id: new mongodb.ObjectID(groupId) });
    client.close();
    return rep;
} 