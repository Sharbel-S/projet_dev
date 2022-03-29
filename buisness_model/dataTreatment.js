var todo_model = require('../models/todo_model');


exports.getAllGroupsById = async function (userId) {
    var res = await todo_model.get_all_groups_for_user(userId);
    return res;
}

exports.getAllTasksById = async function (groupId) {
    var res = await todo_model.get_all_tasks_of_group(groupId);
    return res;
}

exports.getGroupName = async function (groupId) {
    var res = await todo_model.get_group_name_by_id(groupId);
    return res.group;
}

exports.getGroupId = async function (groupId) {
    var res = await todo_model.get_group_name_by_id(groupId);
    return res._id.toString();
}

exports.addNewTodo = async function (body) {
    await todo_model.add_new_todo(body.groupId, body.groupName, body.title, body.limited_date, body.description);
}

exports.modifyTodo = async function (body) {
    await todo_model.edit_todo_info(body.id, body.title, body.description, body.limited_date);
}

exports.editTodoGroup = async function (body) {
    await todo_model.edit_todo_group_info(body.groupId, body.group, body.color);
}