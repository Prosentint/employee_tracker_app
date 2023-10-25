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
                'Delete Employee',
                'View All Roles',
                'Add Role',
                'Delete Role',
                'View All Departments',
                'Add Department',
                'Delete Department',
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
            case 'Delete Employee':
                deleteEmployee();
                break;
            case 'View All Roles':
                viewRoles();
                break;
            case 'Add Role':
                addRole();
                break;
            case 'Delete Role':
                deleteRole();
                break;
            case 'View All Departments':
                viewDepartments();
                break;
            case 'Add Department':
                addDepartment();
                break;
            case 'Delete Department':
                deleteDepartment();
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

         // Set managerId to null if it's blank
         const actualManagerId = managerId.trim() === '' ? null : managerId;

        // Insert the new employee into the database
        db.query(
            'INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)',
            [firstName, lastName, roleId, actualManagerId],
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
                // Return to main menu
                loadMainPrompts();
            }
        );
    });
}

// Function to remove an employee
function deleteEmployee() {
    inquirer.prompt([
        {
            type: 'input',
            name: 'employeeId',
            message: "Enter the ID of the employee you want to remove:",
        },
    ]).then((answer) => {
        const employeeId = answer.employeeId;

        // Delete the employee from the database
        db.query(
            'DELETE FROM employee WHERE id = ?',
            [employeeId],
            (err, results) => {
                if (err) {
                    console.error('Error removing employee: ' + err);
                } else if (results.affectedRows === 0) {
                    console.log('Employee with the provided ID not found.');
                } else {
                    console.log('Employee removed successfully!');
                }
                // Return to main menu
                loadMainPrompts();
            }
        );
    });
}

// Role related functions

function viewRoles() {
    db.query('SELECT * FROM role', (err, results) => {
        if (err) {
            console.error('Error viewing roles: ' + err);
        } else {
            console.table(results);
        }
        // Return to main menu
        loadMainPrompts();
    });
}

function addRole() {
    inquirer.prompt([
        {
            type: 'input',
            name: 'title',
            message: "Enter the role's title:",
        },
        {
            type: 'input',
            name: 'salary',
            message: "Enter the role's salary:",
        },
        {
            type: 'input',
            name: 'departmentId',
            message: "Enter the department ID for the role:",
        },
    ]).then((answers) => {
        const { title, salary, departmentId } = answers;

        db.query(
            'INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)',
            [title, salary, departmentId],
            (err) => {
                if (err) {
                    console.error('Error adding role: ' + err);
                } else {
                    console.log('Role added successfully!');
                }
                // Return to main menu
                loadMainPrompts();
            }
        );
    });
}

// Function to remove a role
function deleteRole() {
    inquirer.prompt([
        {
            type: 'input',
            name: 'roleId',
            message: 'Enter the ID of the role you want to delete:',
        },
    ]).then((answers) => {
        const { roleId } = answers;

        db.query('DELETE FROM role WHERE id = ?', [roleId], (err) => {
            if (err) {
                console.error('Error deleting role: ' + err);
            } else {
                console.log('Role deleted successfully!');
            }
            // Return to main menu
            loadMainPrompts();
        });
    });
}

// Department related functions

// Function to view all departments
function viewDepartments() {
    db.query("SELECT id, name FROM department", (err, results) => {
        if (err) {
            console.error("Error viewing departments: " + err);
        } else {
            // Display departments in a tabular format
            console.table(results);
        }
        // Return to main menu
        loadMainPrompts();
    });
}

// Function to add a department
function addDepartment() {
    inquirer.prompt([
        {
            type: "input",
            name: "name",
            message: "Enter the department name:",
        }
    ]).then((answer) => {
        const { name } = answer;

        // Insert the new department into the database
        db.query(
            "INSERT INTO department (name) VALUES (?)",
            [name],
            (err, results) => {
                if (err) {
                    console.error("Error adding department: " + err);
                } else {
                    console.log("Department added successfully!");
                }
                // Return to main menu
                loadMainPrompts();
            }
        );
    });
}

// Function to delete a department
function deleteDepartment() {
    // Get a list of departments to choose from
    db.query("SELECT id, name FROM department", (err, results) => {
        if (err) {
            console.error("Error fetching departments: " + err);
        } else {
            inquirer.prompt([
                {
                    type: "list",
                    name: "departmentId",
                    message: "Select the department to delete:",
                    choices: results.map((department) => ({
                        name: department.name,
                        value: department.id,
                    })),
                },
            ]).then((answer) => {
                const { departmentId } = answer;

                // Delete the selected department from the database
                db.query(
                    "DELETE FROM department WHERE id = ?",
                    [departmentId],
                    (err) => {
                        if (err) {
                            console.error("Error deleting department: " + err);
                        } else {
                            console.log("Department deleted successfully!");
                        }
                        // Return to main menu
                        loadMainPrompts();
                    }
                );
            });
        }
    });
}




init();