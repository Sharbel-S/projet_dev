var todo_model = require('../models/todo_model');


exports.getAllGroupsById = async function (userId) {
    var res = await todo_model.get_all_groups_for_user(userId);
    return res;
}