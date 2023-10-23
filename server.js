// Dependencies
const inquirer = require("inquirer");
const mysql = require("mysql2");

init();

// TODO add mysql connection

// Initializes program by displaying logo and main prompts
function init() {
    // TODO: add logo

    loadMainPrompts();
}

function loadMainPrompts() {
    //Displays inital prompt options and allows user to select an option
    inquirer.prompt([
        {
            type: 'list',
            name: 'mainPrompt',
            message: 'What would you like to do?',
            choices:[
                'View All Employees',
                'Add Employee',
                'Update Employee Role',
                'View All Roles',
                'Add Role',
                'View All Departments',
                'Add Department',
                'Quit'
            ]
        }
        // TODO add functionality for each case
    ]).then((answer) => {
        switch(answer.intro) {
            case 'View All Employees':
                break;
            case 'Add Employee':
                break;
            case 'Update Employee Role':
                break;
            case 'View All Roles':
                break;
            case 'Add Role':
                break;
            case 'View All Departments':
                break;
            case 'Add Department':
                break;
            case 'Quit':
                console.log('Good-Bye!');
                db.end();
                break;
        }
    });
};

//TODO add functions for pprompt selections