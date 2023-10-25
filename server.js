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
                addEmployee();
                break;
            case 'Update Employee Role':
                updateEmployeeRole()
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

// Employee related functions

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

function addEmployee() {
    // Takes user input for new employee
    inquirer.prompt([
        {
            type: 'input',
            name: 'firstName',
            message: "Enter the employee's first name:",
        },
        {
            type: 'input',
            name: 'lastName',
            message: "Enter the employee's last name:",
        },
        {
            type: 'input',
            name: 'roleId',
            message: "Enter the employee's role ID:",
        },
        {
            type: 'input',
            name: 'managerId',
            message: "Enter the employee's manager's ID (if applicable):",
        },
    ]).then((answers) => {
        const { firstName, lastName, roleId, managerId } = answers;

        // If managerId is empty, set it to null
        const managerIdValue = managerId.trim() ? managerId : null;

        // Insert the new employee into the database
        db.query(
            'INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)',
            [firstName, lastName, roleId, managerId],
            (err, results) => {
                if (err) {
                    console.error('Error adding employee: ' + err);
                } else {
                    console.log('Employee added successfully!');
                }
                // Return to the main menu
                loadMainPrompts();
            }
        );
    });
}

// Function to update an employee's role
function updateEmployeeRole() {
    inquirer.prompt([
        {
            type: 'input',
            name: 'employeeId',
            message: "Enter the ID of the employee you want to update:",
        },
        {
            type: 'input',
            name: 'newRoleId',
            message: "Enter the new role ID for the employee:",
        },
    ]).then((answers) => {
        const { employeeId, newRoleId } = answers;

        // Update the employee's role in the database
        db.query(
            'UPDATE employee SET role_id = ? WHERE id = ?',
            [newRoleId, employeeId],
            (err, results) => {
                if (err) {
                    console.error('Error updating employee role: ' + err);
                } else {
                    console.log('Employee role updated successfully!');
                }
                // Continue with main prompts
                loadMainPrompts();
            }
        );
    });
}



init();