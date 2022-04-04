var todo_model = require('../models/todo_model');
var account_model = require('../models/account_model');

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

exports.addNewTodo = async function (body, res) {
    await todo_model.add_new_todo(body.groupId, body.groupName, body.title, body.limited_date, body.description);
    res.send("done");
}

exports.modifyTodo = async function (body, res) {
    await todo_model.edit_todo_info(body.id, body.title, body.description, body.limited_date);
    res.send("done");
}

exports.editTodoGroup = async function (body, res) {
    await todo_model.edit_todo_group_info(body.groupId, body.group, body.color);
    res.send("done !");
}

exports.getGroupInfo = async function (groupId, res) {
    var response = await todo_model.get_group_info(groupId);
    res.send(response[0]);
}

exports.changeTodoStatusToDone = async function (taskId, res) {
    await todo_model.set_todo_status_to_done(taskId)
    res.send("done");
}

exports.changeTodoStatus = async function (taskId, res) {
    await todo_model.set_todo_status_to_todo(taskId);
    res.send("done");
}

exports.deleteTask = async function (taskId, groupId, res) {
    await todo_model.delete_selected_todo(taskId);
    res.send("done");
}

exports.deleteGroup = async function (groupId, res) {
    await todo_model.delete_selected_todo_group(groupId);
    res.send("done")
}

exports.addNewTodoGroup = async function (userId, group, color, res) {
    await todo_model.add_new_todo_group(userId, group, color);
    res.send("done");
}

exports.tryToSignIn = async function (req, res) {
    var response = await account_model.check_email_password_account(req.body.email, req.body.password);
    if (response == null) {
        showErrorMessageForSignIn(req, res);
    }
    else {
        signIn(req, res, response);
    }
}

function showErrorMessageForSignIn(req, res) {
    req.flash('info', 'Incorect username or password');
    res.redirect('/signInPage');
}

function signIn(req, res, response) {
    req.session.userId = response;
    res.locals.authenticated = true;
    res.redirect('./mainPage');
}

exports.tryToSignUp = async function (req, res) {
    var response = await account_model.check_if_email_already_used(req.body.email);
    if (!response) {
        checkIfPasswordAndConfimationCorrect(req, res, response);
    }
    else {
        showErrorMessageForSignUp(req, res);
    }
}

function showErrorMessageForSignUp(req, res) {
    req.flash('info', 'Email already used');
    res.redirect('/signUpPage');
}

function checkIfPasswordAndConfimationCorrect(req, res, response) {
    if (req.body.password !== req.body.confirmPassword) {
        req.flash('info', 'Password and confirmation are not the same');
        res.redirect('/signUpPage');
    }
    else {
        createAcount(req, res, response);
    }
}

async function createAcount(req, res, response) {
    var responseId = await account_model.create_new_account(req.body.email, req.body.password);
    if (response != null) {
        res.locals.authenticated = true;
        req.session.userId = responseId;
        res.redirect('./mainPage');
    }
}


// CLI
exports.editTodoGroup = async function (groupId, group, color) {
    var res = await todo_model.edit_todo_group_info(groupId, group, color);
    return res;
}

exports.checkIfEmailAleadyUsedCLI = async function (email) {
    var emailUsed = await account_model.check_if_email_already_used(email)
    if (!emailUsed) {
        return true;
    }
    else {
        return null;
    }
}

exports.createAccountCLI = async function (email, password) {
    var responseId = await account_model.create_new_account(email, password);
    return responseId;
}

exports.tryToSignInCLI = async function (email, password) {
    var response = await account_model.check_email_password_account(email, password);
    return response;
}

exports.addNewTodoGroupCLI = async function (userId, group, color) {
    var response = await todo_model.add_new_todo_group(userId, group, color);
    return response;
}

exports.deleteGroupByNameCLI = async function (userId, group) {
    var response = await todo_model.delete_selected_group_by_name(userId, group)
    return response;
}

exports.checkGroupExistCLI = async function (group) {
    var response = await todo_model.check_if_group_exist(group);
    return response;
}

exports.addNewTodoCLI = async function (groupId, groupName, title, limited_date, description) {
    var res = await todo_model.add_new_todo(groupId, groupName, title, limited_date, description);
    return res;
}