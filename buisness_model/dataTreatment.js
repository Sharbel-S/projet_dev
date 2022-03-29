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