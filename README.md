# TaskManager-Node-API-Authentication

Task Manager Node API Authentication
This is a simple Node.js application that provides a REST API for managing tasks. It uses the Express framework, and the tasks are stored in an in-memory data structure.

Prerequisites
To run this application, you need Node.js installed on your system. You can download it from here.

Installation
Clone this repository to your local machine
Navigate to the project directory
Run npm install to install the dependencies
Run npm start to start the server
API Endpoints
Tasks
Get all tasks
GET /tasks

Returns a list of all tasks.

Get a task
GET /tasks/:id

Returns the task with the specified id.

Create a task
POST /tasks

Creates a new task with the given data.

Update a task
PUT /tasks/:id

Updates the task with the specified id with the given data.

Delete a task
DELETE /tasks/:id

Deletes the task with the specified id.

Testing
You can test the API using a tool like Postman.

Contributing
Contributions are welcome! Please submit a pull request for any changes you would like to make.

Contact
If you have any questions or feedback, please contact me at arshbhushan3@gmail.com
