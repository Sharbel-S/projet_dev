"use strict"
const chalk = require("chalk");
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

exports.askForEmailToSignUp = function (rl) {
    return new Promise((resolve, reject) => {
        rl.question('enter an email: ', (email) => {
            newEmail = email;
            resolve();
            checkEmail(rl);
        });
    })
}

async function checkEmail(rl) {
    var res = await dataTreatment.checkIfEmailAleadyUsedCLI(newEmail);
    if (res) {
        askForPasswordToSignUp(rl);
    }
    else {
        console.log(chalk.red("Email already used !"));
    }
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
            checkIfPasswordsAreCorrect(PasswordConfirmation);
        });
    })
}

async function checkIfPasswordsAreCorrect(PasswordConfirmation) {
    if (PasswordConfirmation !== newPassord) {
        console.log(chalk.red("Password and confirmation are not the same"));
    }
    else {
        var res = await dataTreatment.createAccountCLI(newEmail, newPassord);
        if (res != null) {
            idUser = res;
            isConnected = true;
            console.log(chalk.green("Account created successfully"));
            console.log(chalk.green("Connected with success !"));
        }
    }
}

exports.askForEmailToSignIn = function (rl) {
    if (isConnected) {
        console.log(chalk.yellow("You must sign out to sign in with another account"));
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
            checkEmailPassword();
        });
    })
}

async function checkEmailPassword() {
    var res = await dataTreatment.tryToSignInCLI(emailLog, passwordLog);
    if (res != null) {
        idUser = res;
        isConnected = true;
        console.log(chalk.green("Connected with success !"));
        getAllGroupsForUser(idUser);
    }
    else {
        console.log(chalk.red("Username or Password incorrect !"));
    }
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


exports.printAllGroups = async function () {
    if (isConnected) {
        var respone = await dataTreatment.getAllGroupsById(idUser);
        printAllGroupsForUser(respone);
    }
    else {
        console.log(chalk.yellow("You must to signin !"));
    }
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
            'Available colors (Please respect the code colors !) :\n ' +
            '"danger" for red - "info" for blue -"success" for green -"warning" for yellow - "dark" for dark - "secondary" for gray - "light" for white. \n ', (newGroupColor) => {
                colorNewGroup = newGroupColor;
                resolve();
                createNewGroup();
            });
    })
}

async function createNewGroup() { // TODO : Faire les couleurs correctement
    var response = await dataTreatment.addNewTodoGroupCLI(idUser, nameNewGroup, colorNewGroup);
    if (response) {
        console.log(chalk.green("Group has been created successfully !"));
    }
    else {
        console.log(chalk.red("Something went wrong, please try again"));
    }
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

async function removeGroup(group) {
    var respone = await dataTreatment.deleteGroupByNameCLI(idUser, group);
    if (respone.deletedCount != 0) {
        console.log("Group removed successfully !")
    }
    else {
        console.log(chalk.red("Something went wrong, please try again"));
    }
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
    var response = await dataTreatment.checkGroupExistCLI(group);
    if (response) {
        groupSelectedId = response._id.toString();
        colorNewGroup = response.color;
        groupSelected = response.group;
        askForColumnToModifyGroup(rl);
    }
    else {
        console.log(chalk.yellow("group not found"));
    }
}

function askForColumnToModifyGroup(rl) {
    return new Promise((resolve, reject) => {
        rl.question('enter the column you want to modify :\n -name\n -color\n ', (response) => {
            resolve();
            switch (response) {
                case "name":
                    askForNewGroupName(rl);
                    break;

                case "color":
                    askForNewGroupColor(rl);
                    break;

                default:
                    console.log(chalk.yellow('Column not found'));
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

function askForNewGroupColor(rl) {
    return new Promise((resolve, reject) => {
        rl.question('enter the new color for the group : \nfor red type: danger\nfor blue type info\nfor green type success\nfor dark type dark\nfor grey type secondary\nfor yellow type warning\n', (color) => {
            resolve();
            modifyColorIfNoErrors(color);
        });
    })
}

async function modifyNameIfNoErrors(group) {
    var res = await dataTreatment.editTodoGroupCLI(groupSelectedId, group, colorNewGroup);
    if (res.modifiedCount == 1) {
        console.log(chalk.green("Modified with success"));
    }
    else {
        console.log(chalk.red("Something went wrong, please try again"));
    }
}

async function modifyColorIfNoErrors(color) {
    var res = await dataTreatment.editTodoGroupCLI(groupSelectedId, groupSelected, color);
    if (res.modifiedCount == 1) {
        console.log(chalk.green("Modified with success"));
    } else {
        console.log(chalk.red("Something went wrong, please try again"));
    }
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

async function choseGroupIfExist(group) {
    var response = await dataTreatment.checkGroupExistCLI(group);
    if (response != null) {
        isGroupSelected = true;
        groupSelected = group;
        groupSelectedId = response._id.toString();
        console.log("Group", groupSelected, "is now selected !");
    }
    else {
        console.log(chalk.yellow("Group not found, please make sur that the group already exist !"));
    }
}

exports.printAllTodosOfGroup = async function () {
    if (isConnected) {
        if (isGroupSelected) {
            var respone = await dataTreatment.getAllTasksById(groupSelectedId);
            printTasksJson(respone);
        }
        else {
            console.log(chalk.yellow("You must choose a group !"));
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
        console.log("----------------------------------");
        console.log("----------------------------------");
    });
}

exports.askForTitleToAddNewTodo = function (rl) {
    if (isConnected) {
        if (isGroupSelected) {
            return new Promise((resolve, reject) => {
                rl.question('enter a title: ', (inputTitle) => {
                    if (inputTitle === "") {
                        console.log(chalk.yellow("Title cannot be empty !"));
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
            console.log(chalk.yellow('You must choose a group !'));
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

async function addNewTodo() {
    var response = await dataTreatment.addNewTodoCLI(groupSelectedId, groupSelected, todoTitle, todoDate, todoDescription);
    if (response != null) {
        console.log(chalk.green("Data inserted successfully !"));
    }
    else {
        console.log(chalk.yellow("Something went wrong, please try again"));
    }
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
            console.log(chalk.yellow("You must choose a group !"));
        }
    }
    else {
        console.log(chalk.yellow("You must to signin !"));
    }
}

async function removeTodo(title) {
    var respone = await dataTreatment.deleteTodoByTitleCLI(title, groupSelected, groupSelectedId);
    if (respone.deletedCount != 0) {
        console.log(chalk.green("Todo removed successfully !"))
    }
    else {
        console.log(chalk.yellow("Something went wrong, please try again"));
    }
}

exports.askForColumnToModify = function (rl) { // TODO ajouter la modification de status
    if (isConnected) {
        if (isGroupSelected) {
            return new Promise((resolve, reject) => {
                rl.question('enter the column you want to modify :\n -title\n -date\n -description\n -status\n', (response) => {
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
                        case "status":
                            changeTodoStatus(rl);
                            break;

                        default:
                            console.log(chalk.red('Column not found'));
                    }
                });
            })
        }
        else {
            console.log(chalk.yellow("You must choose a group !"))
        }
    }
    else {
        console.log(chalk.yellow("You must to signin !"));
    }
}

function askForTitleToModifyTodo(rl) {
    rl.question('enter the title: ', async (title) => {
        todoTitle = title;
        var response = await dataTreatment.checkTitleExistCLI(groupSelectedId, title);
        if (response) {
            rl.question('enter the new title: ', (Newtitle) => {
                todoNewTitle = Newtitle;
                modifyTodoTitle();
            })
        }
        else {
            console.log(chalk.yellow("Title doesn't exit !"));
        }
    });
}

async function modifyTodoTitle() {
    var response = await dataTreatment.modifyTitleCLI(groupSelectedId, todoTitle, todoNewTitle);
    if (response) {
        console.log(chalk.green("Title has been modified !"));
    }
    else {
        console.log(chalk.yellow("Something went wrong, please try again !"));
    }
}

function askForDateToModifyTodo(rl) {
    rl.question('enter the title: ', (title) => {
        todoTitle = title;
        rl.question('enter the new date: ', (NewDate) => {
            todoNewDate = NewDate;
            modifyTodoDate();
        })
    });
}

async function modifyTodoDate() {
    var response = await dataTreatment.modifyDateCLI(groupSelectedId, todoTitle, todoNewDate);
    if (response) {
        console.log(chalk.green("Date has been modified !"));
    }
    else {
        console.log(chalk.yellow("Something went wrong, please try again !"));
    }
}

function askForDescriptionToModifyTodo(rl) {
    rl.question('enter the title: ', (title) => {
        todoTitle = title;
        rl.question('enter the new description: ', (Newdetails) => {
            todoNewDescription = Newdetails;
            modifyTodoDescription();
        })
    });
}


async function modifyTodoDescription() {
    var response = await dataTreatment.modifyDescriptionCLI(groupSelectedId, todoTitle, todoNewDescription);
    if (response) {
        console.log(chalk.green("Description has been modified !"));
    }
    else {
        console.log(chalk.yellow("Something went wrong, please try again !"));
    }
}

function changeTodoStatus(rl) {
    rl.question('enter the title: ', (title) => {
        todoTitle = title;
        getTodoStatusAndChangeIt();
    });
}
async function getTodoStatusAndChangeIt() {
    var response = await dataTreatment.getTodoStauts(todoTitle);
    var taskId = response._id.toString();
    if (response.status == "todo") {
        dataTreatment.changeTodoStatusToDoneCLI(taskId);
        console.log(chalk.green("todo has been changed to done ! "));
    } else {
        dataTreatment.changeTodoStatusCLI(taskId);
        console.log(chalk.green("todo has been changed to not done ! "));
    }
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
    console.log(chalk.green("sign out successfully !"));
}























