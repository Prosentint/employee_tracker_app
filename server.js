// Dependencies
const inquirer = require("inquirer");
const mysql = require("mysql2");

// Mysql database connection
// Connect to database
const db = mysql.createConnection(
    {
        host: "localhost",
        user: "root",
        password: "dolphin4275",
        database: "employee_db",
    },
);

db.connect((err) => {
    if (err) {
        console.error('There was an error connecting to the database: ' + err.stack);
        return;
    }
    console.log('Connection to employee database was successful.');
});

// Initializes program by displaying logo and main prompts
function init() {
    // TODO: Change LOGO to better ascii art if time allows
    console.log("########################################");
    console.log("#           EMPLOYEE TRACKER           #");
    console.log("########################################");

    // Loads inquirer prompts
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
        switch(answer.mainPrompt) {
            case 'View All Employees':
                viewAllEmployees();
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

//TODO add functions for prompt selections

function viewAllEmployees() {
    // Perform a SQL query to retrieve all employees from the database
    const query = 'SELECT * FROM employee';
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error viewing employees: ' + err);
            return;
        }
        // Displays the results
        console.table(results); 
        // Return to the main menu
        loadMainPrompts(); 
    });
}



init();