"use strict"
const chalk = require("chalk");
var controler = require('./controler.js');
var todo_model = require('../models/todo_model');
var account_model = require('../models/account_model');

var todoTitle = "";
var todoDetails = "";
var todoNewTitle = "";
var todoNewDate = "";
var todoNewDetails = "";
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
    console.log(chalk.cyanBright("type info for details."));
    console.log(chalk.cyanBright("type add to add new todo"));
    console.log(chalk.cyanBright("type modify to change a todo"));
    console.log(chalk.cyanBright("type remove to delete a todo"));
    console.log(chalk.cyanBright("type signup to create an account"));
    console.log(chalk.cyanBright("type login to log to your account"));
    console.log(chalk.cyanBright("type list to print all available todos"));
    console.log(chalk.cyanBright("type exit to close the application"));
    console.log("----------------------------------")
}

exports.printAddDetails = function () {
    console.log("----------------------------------");
    console.log(chalk.yellow("How to add new todo: "))
    console.log();
    console.log(("1- write: add"));
    console.log(("2- enter the title of your todo and press Enter"));
    console.log(("3- enter the Description of your todo and press Enter"));
    console.log();
    console.log(chalk.green("Well done! you have juste added a new todo to your list !"));
    console.log("----------------------------------");
}

exports.printRemoveDetails = function () {
    console.log("----------------------------------");
    console.log(chalk.yellow("How to remove a todo: "))
    console.log();
    console.log(("1- write: remove"));
    console.log(("2- enter the title of your todo that you want to remove and press Enter"));
    console.log();
    console.log(chalk.green("Well done! you have juste removed your todo!"));
    console.log("----------------------------------");
}

exports.printListeDetails = function () {
    console.log("----------------------------------");
    console.log(chalk.yellow("How to print the list of todos: "))
    console.log();
    console.log(("1- write: list"));
    console.log();
    console.log(chalk.green("Well done! you have juste printed all your todos!"));
    console.log("----------------------------------");
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
            todoDetails = inputDescription;
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
    todo_model.add_new_todo(groupSelectedId, groupSelected, todoTitle, todoDate, todoDetails).then((response) => {
        if (response != null) {
            console.log("Data inserted successfully !")
        }
        else {
            console.log("Something went wrong, please try again");
        }
    })
}


exports.askForModify = function (rl) {
    if (isConnected) {
        if (isGroupSelected) {
            rl.question('enter the title: ', (title) => {
                todoTitle = title;
                controler.checkIfTitleExist(title).then((response) => {
                    if (response) {
                        rl.question('enter the new title: ', (Newtitle) => {
                            todoNewTitle = Newtitle;
                            controler.modifyActualTitle(todoTitle, todoNewTitle);
                        })
                    }
                    else {
                        console.log("Title doesn't exit !");
                    }
                });


            });
        }
        else {
            console.log("You must choose a group !")
        }

    }
    else {
        console.log(chalk.yellow("You must to login !"));
    }
}

exports.askForModifyTheDate = function (rl) {
    if (isConnected) {
        if (isGroupSelected) {
            rl.question('enter the date: ', (date) => {
                todoDate = date;
                rl.question('enter the new date: ', (NewDate) => {
                    todoNewDate = newDate;
                    controler.modifyActualDate(todoDate, todoNewDate);
                })
            });
        }
        else {
            console.log("You must choose a group !")
        }

    }
    else {
        console.log(chalk.yellow("You must to login !"));
    }
}

exports.askForModifyTheDetails = function (rl) {
    if (isConnected) {
        if (isGroupSelected) {
            rl.question('enter the details: ', (details) => {
                todoDetails = details;
                rl.question('enter the new details: ', (Newdetails) => {
                    todoNewDetails = Newdetails;
                    controler.modifyActualDetails(todoDetails, todoNewDetails);
                })
            });
        }
        else {
            console.log("You must choose a group !")
        }

    }
    else {
        console.log(chalk.yellow("You must to login !"));
    }
}

exports.askForColumnToModify = function (rl) {
    return new Promise((resolve, reject) => {
        rl.question('enter the column you want to modify :\n -title\n  -date\n  -details\n ', (response) => {
            resolve();
            switch (response) {
                case "Title":
                    askForModify(rl);
                    break;

                case "Date":
                    askForModifyTheDate(rl);
                    break;

                case "Details":
                    askForModifyTheDetails(rl);
                    break;

                default:
                    console.log(chalk.red('Column not found'));
            }
        });
    })
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

exports.askForEmailToLogin = function (rl) {
    return new Promise((resolve, reject) => {
        rl.question('enter your email: ', (email) => {
            emailLog = email;
            resolve();
            askForPasswordToLogin(rl);
        });
    })
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
                    printAllGroupsForUser(idUser);
                }
                else {
                    console.log("Username or Password incorrect !");
                }
            })
        });
    })
}

function printAllGroupsForUser(idUser) {
    todo_model.get_all_groups_for_user(idUser).then((response) => {
        console.log(response);
    })
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
        console.log(chalk.yellow("You must to login !"));
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
        console.log(chalk.yellow("You must to login !"));
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
    todoDetails = "";
    todoNewTitle = "";
    todoNewDate = "";
    todoNewDetails = "";
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
        console.log(chalk.yellow("You must to login !"));
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
        console.log(chalk.yellow("You must to login !"));
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