"use strict"
const chalk = require("chalk");
var todo_model = require('../models/todo_model');
var account_model = require('../models/account_model');
var dataTreatment = require('../buisness_model/dataTreatment');


var todoTitle = "";
var todoDescription = "";
var todoNewTitle = "";
var todoNewDate = "";
var todoNewDescription = "";
var newEmail = "";
var newPassord = "";
var todoDate = "";
var emailLog = "";
var passwordLog = "";
var idUser = "";
var groupSelected = "";
var groupSelectedId = "";
var nameNewGroup = "";
var colorNewGroup = "";
var isConnected = false;
var isGroupSelected = false;

exports.printStartProgramme = function () {
    console.log(chalk.green("/********* Welcome to MY_TODO *********/"));
    console.log("");
    console.log("----------------------------------")
    console.log(chalk.cyanBright("type info for description"));
    console.log(chalk.cyanBright("type signin to sign in to your account"));
    console.log(chalk.cyanBright("type signup to create an account"));

    console.log(chalk.cyanBright("type addgroup to add a new group"));
    console.log(chalk.cyanBright("type removegroup to delete a group"));

    console.log(chalk.cyanBright("type selectgroup to select your group"));

    console.log(chalk.cyanBright("type addtodo to add new todo"));
    console.log(chalk.cyanBright("type modifytodo to change a todo"));
    console.log(chalk.cyanBright("type removetodo to delete a todo"));
    console.log(chalk.cyanBright("type signout to disconnect"));
    console.log(chalk.cyanBright("type exit to close the application"));
    console.log("----------------------------------")
}


exports.askForTitleToAddNewTodo = function (rl) {
    if (isConnected) {
        if (isGroupSelected) {
            return new Promise((resolve, reject) => {
                rl.question('enter a title: ', (inputTitle) => {
                    if (inputTitle === "") {
                        console.log("Title cannot be empty !");
                    }
                    else {
                        todoTitle = inputTitle;
                        resolve();
                        askForDescriptionToAddNewTodo(rl);
                    }
                });
            })
        }
        else {
            console.log('You must choose a group !');
        }
    }
    else {
        console.log(chalk.yellow("You must to login !"));
    }

}


function askForDescriptionToAddNewTodo(rl) {
    return new Promise((resolve, reject) => {
        rl.question('enter a Description: ', (inputDescription) => {
            todoDescription = inputDescription;
            resolve();
            askForDateToAddNewTodo(rl);
        });
    })
}

function askForDateToAddNewTodo(rl) {
    return new Promise((resolve, reject) => {
        rl.question('enter a limite Date: ', (inputDate) => {
            todoDate = inputDate;
            resolve();
            addNewTodo();
        });
    })
}

function addNewTodo() {
    todo_model.add_new_todo(groupSelectedId, groupSelected, todoTitle, todoDate, todoDescription).then((response) => {
        if (response != null) {
            console.log("Data inserted successfully !")
        }
        else {
            console.log("Something went wrong, please try again");
        }
    })
}


function askForTitleToModifyTodo(rl) {
    rl.question('enter the title: ', (title) => {
        todoTitle = title;
        todo_model.check_if_title_exist(groupSelectedId, title).then((response) => {
            if (response) {
                rl.question('enter the new title: ', (Newtitle) => {
                    todoNewTitle = Newtitle;
                    todo_model.modify_actual_title_for_todo(groupSelectedId, todoTitle, todoNewTitle);
                })
            }
            else {
                console.log("Title doesn't exit !");
            }
        });
    });
}

function askForDateToModifyTodo(rl) {
    rl.question('enter the title: ', (title) => {
        todoTitle = title;
        rl.question('enter the new date: ', (NewDate) => {
            todoNewDate = NewDate;
            todo_model.modify_actual_date_for_todo(groupSelectedId, todoTitle, todoNewDate);
        })
    });
}

function askForDescriptionToModifyTodo(rl) {
    rl.question('enter the title: ', (title) => {
        todoTitle = title;
        rl.question('enter the new description: ', (Newdetails) => {
            todoNewDescription = Newdetails;
            todo_model.modify_actual_description_for_todo(groupSelectedId, todoTitle, todoNewDescription);
        })
    });
}

exports.askForColumnToModify = function (rl) {
    if (isConnected) {
        if (isGroupSelected) {
            return new Promise((resolve, reject) => {
                rl.question('enter the column you want to modify :\n -title\n  -date\n  -description\n ', (response) => {
                    resolve();
                    switch (response) {
                        case "title":
                            askForTitleToModifyTodo(rl);
                            break;

                        case "date":
                            askForDateToModifyTodo(rl);
                            break;

                        case "description":
                            askForDescriptionToModifyTodo(rl);
                            break;

                        default:
                            console.log(chalk.red('Column not found'));
                    }
                });
            })
        }
        else {
            console.log("You must choose a group !")
        }
    }
    else {
        console.log(chalk.yellow("You must to signin !"));
    }

}

exports.askForEmailToSignUp = function (rl) {
    return new Promise((resolve, reject) => {
        rl.question('enter an email: ', (email) => {
            newEmail = email;
            resolve();
            account_model.check_if_email_already_used(newEmail).then((response) => {
                if (!response) {
                    askForPasswordToSignUp(rl);
                }
                else {
                    console.log("Email already used !");
                }
            })
        });
    })
}

function askForPasswordToSignUp(rl) {
    return new Promise((resolve, reject) => {
        rl.question('enter a password: ', (Password) => {
            newPassord = Password;
            resolve();
            askForConfirmationPassword(rl);
        });
    })
}

function askForConfirmationPassword(rl) {
    return new Promise((resolve, reject) => {
        rl.question('enter confimation password: ', (PasswordConfirmation) => {
            resolve();
            if (PasswordConfirmation !== newPassord) {
                console.log("Password and confirmation are not the same");
            }
            else {
                account_model.create_new_account(newEmail, newPassord).then((response) => {
                    if (response != null) {
                        idUser = response;
                        isConnected = true;
                        console.log("Account created successfully");
                        console.log("Connected with success !");
                    }
                });
            }
        });
    })
}

exports.askForEmailToSignIn = function (rl) {
    if (isConnected) {
        console.log("You must sign out to sign in with another account");
    }
    else {
        return new Promise((resolve, reject) => {
            rl.question('enter your email: ', (email) => {
                emailLog = email;
                resolve();
                askForPasswordToLogin(rl);
            });
        })
    }
}


function askForPasswordToLogin(rl) {
    return new Promise((resolve, reject) => {
        rl.question('enter your password: ', (password) => {
            passwordLog = password;
            resolve();
            account_model.check_email_password_account(emailLog, passwordLog).then((response) => {
                if (response != null) {
                    idUser = response;
                    isConnected = true;
                    console.log("Connected with success !");
                    getAllGroupsForUser(idUser);
                }
                else {
                    console.log("Username or Password incorrect !");
                }
            })
        });
    })
}

async function getAllGroupsForUser(idUser) {
    var response = await dataTreatment.getAllGroupsById(idUser);
    printAllGroupsForUser(response);
}

function printAllGroupsForUser(response) {
    console.log("----------------------------------");
    console.log("----------------------------------");
    response.forEach(async (element, index) => {
        var groupColor = await getTheColorOfGroup(element.color);

        console.log(chalk.hex(groupColor)(index));
        console.log(chalk.hex(groupColor)("group: ", element.group));
        console.log(chalk.hex(groupColor)("creation date: ", element.creationDate));

        console.log("----------------------------------");
        console.log("----------------------------------");
    });
}


function getTheColorOfGroup(color) {
    var colorForChalk;
    switch (color) {
        case "danger":
            colorForChalk = "#FF0000"; // red color
            break;
        case "primary":
            colorForChalk = "#0000FF"; // blue
            break;
        case "success":
            colorForChalk = "#00FF00"; // green
            break;
        case "warning":
            colorForChalk = "#FFFF00"; // yellow
            break;
        case "info":
            colorForChalk = "##00FFFF"; // blue ciel
            break;
        case "secondary":
            colorForChalk = "#808080"; // grey
            break;
        case "dark":
            colorForChalk = "#000000"; // dark
            break;
        default:
            colorForChalk = "#FFFFFF"; // white
    }
    return colorForChalk;
}

exports.askForTitleToRemove = function (rl) {
    if (isConnected) {
        if (isGroupSelected) {
            return new Promise((resolve, reject) => {
                rl.question('enter the title of the todo you want to delete: ', (title) => {
                    resolve();
                    removeTodo(title);
                });
            })
        }
        else {
            console.log("You must choose a group !");
        }
    }
    else {
        console.log(chalk.yellow("You must to signin !"));
    }
}


function removeTodo(title) {
    todo_model.delete_selected_todo_by_name(title, groupSelected, groupSelectedId).then((respone) => {
        if (respone.deletedCount != 0) {
            console.log("Todo removed successfully !")
        }
        else {
            console.log("Something went wrong, please try again");
        }
    })
}

exports.askForGroup = function (rl) {
    if (isConnected) {
        return new Promise((resolve, reject) => {
            rl.question('enter the group of the todo you want to choose: ', (group) => {
                resolve();
                choseGroupIfExist(group);
            });
        })
    }
    else {
        console.log(chalk.yellow("You must to signin !"));
    }
}

function choseGroupIfExist(group) {
    todo_model.check_if_group_exist(group).then((response) => {
        if (response != null) {
            isGroupSelected = true;
            groupSelected = group;
            groupSelectedId = response._id.toString();
            console.log("Group", groupSelected, "is now selected !");
        }
        else {
            console.log("Group not found, please make sur that the group already exist !");
        }
    })
}

exports.signOut = function () {
    isConnected = false;
    isGroupSelected = false;
    todoTitle = "";
    todoDescription = "";
    todoNewTitle = "";
    todoNewDate = "";
    todoNewDescription = "";
    newEmail = "";
    newPassord = "";
    todoDate = "";
    emailLog = "";
    passwordLog = "";
    idUser = "";
    groupSelected = "";
    console.log("sign out successfully !");
}

exports.askForNameForNewGroup = async function (rl) {
    if (isConnected) {
        return new Promise((resolve, reject) => {
            rl.question('enter name of the new group : ', (newGroupName) => {
                nameNewGroup = newGroupName;
                resolve();
                askForColorForNewGroup(rl);
            });
        })
    }
    else {
        console.log(chalk.yellow("You must to signin !"));
    }

}

function askForColorForNewGroup(rl) {
    return new Promise((resolve, reject) => {
        rl.question('enter color of the new group : \n' +
            'Available colors :\n ' +
            'red - blue - green - yellow - dark - gray - white. \n ', (newGroupColor) => {
                colorNewGroup = newGroupColor;
                resolve();
                createNewGroup();
            });
    })
}

function createNewGroup() { // TODO : Faire les couleurs correctement
    todo_model.add_new_todo_group(idUser, nameNewGroup, colorNewGroup).then((response) => {
        if (response) {
            console.log(chalk.green("Group has been created successfully ! "));
        } else {
            console.log("Something went wrong, please try again");
        }
    })
}

exports.askForGroupNameToRemove = async function (rl) {
    if (isConnected) {
        return new Promise((resolve, reject) => {
            rl.question('enter the name of the group you want to remove: ', (group) => {
                resolve();
                removeGroup(group);
            });
        })
    }
    else {
        console.log(chalk.yellow("You must to signin !"));
    }
}

function removeGroup(group) {
    todo_model.delete_selected_group_by_name(idUser, group).then((respone) => {
        if (respone.deletedCount != 0) {
            console.log("Group removed successfully !")
        }
        else {
            console.log("Something went wrong, please try again");
        }
    })
}

exports.printAllGroups = async function () {
    if (isConnected) {
        var respone = await todo_model.get_all_groups_for_user(idUser);
        printAllGroupsForUser(respone);
    }
    else {
        console.log(chalk.yellow("You must to signin !"));
    }
}


exports.printAllTasksOfGroup = async function () {
    if (isConnected) {
        if (isGroupSelected) {
            var respone = await todo_model.get_all_tasks_of_group(groupSelectedId);
            printTasksJson(respone);
        }
        else {
            console.log("You must choose a group !");
        }
    }
    else {
        console.log(chalk.yellow("You must to signin !"));
    }
}

function printTasksJson(response) {
    console.log("----------------------------------");
    console.log("----------------------------------");
    response.forEach((element, index) => {
        console.log(index);
        console.log("title: ", element.title);
        console.log("description: ", element.description);
        console.log("limit date: ", element.limited_date);
        console.log("status: ", element.status == "todo" ? "⏳" : "✅");


        //console.log("created in: ", element.creationDate);
        console.log("----------------------------------");
        console.log("----------------------------------");
    });
}

exports.askForGroupNameToModify = async function (rl) {
    if (isConnected) {
        return new Promise((resolve, reject) => {
            rl.question('enter the name of the group you want to modify: ', (group) => {
                resolve();
                checkIfGroupExist(group, rl);
            });
        })
    }
    else {
        console.log(chalk.yellow("You must to signin !"));
    }
}

async function checkIfGroupExist(group, rl) {
    var response = await todo_model.check_if_group_exist(group);
    if (response) {
        groupSelectedId = response._id.toString();
        colorNewGroup = response.color;
        askForColumnToModifyGroup(rl);
    }
    else {
        console.log("group not found");
    }
}

function askForColumnToModifyGroup(rl) {
    return new Promise((resolve, reject) => {
        rl.question('enter the column you want to modify :\n -name\n  -color\n ', (response) => {
            resolve();
            switch (response) {
                case "name":
                    askForNewGroupName(rl);
                    break;

                case "color":
                    askForDateToModifyTodo(rl);
                    break;

                default:
                    console.log(chalk.red('Column not found'));
            }
        });
    })
}

function askForNewGroupName(rl) {
    return new Promise((resolve, reject) => {
        rl.question('enter the new name for the group : ', (group) => {
            resolve();
            modifyNameIfNoErrors(group);
        });
    })
}

async function modifyNameIfNoErrors(group) {
    var res = await dataTreatment.editTodoGroup(groupSelectedId, group, colorNewGroup);
    if (res.modifiedCount == 1) {
        console.log("Modified with success");
    }
    else {
        console.log("Something went wrong, please try again !");
    }

}