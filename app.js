// Define the AngularJS module
var app = angular.module('taskApp', []);

// App Component (Root Component)
app.component('app', {
    template: `
        <header-component></header-component>
        <task-list></task-list>
    `
});

// Header Component
app.component('headerComponent', {
    template: `
        <header>
            <h1>{{ $ctrl.title }}</h1>
        </header>
    `,
    controller: function() {
        this.title = 'Task Management App';
    }
});

// Task List Component with Add, Edit, and Delete functionality
app.component('taskList', {
    template: `
        <section>
            <h2>Task List</h2>
            <!-- Form to Add Task -->
            <form ng-submit="$ctrl.addTask($ctrl.newTask)">
                <input type="text" ng-model="$ctrl.newTask" placeholder="Enter new task" required>
                <button type="submit">Add Task</button>
            </form>

            <!-- Task List -->
            <ul>
                <task-item ng-repeat="task in $ctrl.tasks" task="task" on-delete="$ctrl.deleteTask($index)" on-edit="$ctrl.editTask($index, updatedTask)"></task-item>
            </ul>
        </section>
    `,
    controller: function() {
        this.tasks = [];

        // Function to add a new task with a timestamp
        this.addTask = function(newTaskName) {
            if (newTaskName) {
                var newTask = {
                    name: newTaskName,
                    completed: false,
                    timestamp: new Date() // Add current date and time as timestamp
                };
                this.tasks.push(newTask);
                this.newTask = ''; // Clear the input field after adding
            }
        };

        // Function to delete a task
        this.deleteTask = function(index) {
            this.tasks.splice(index, 1);
        };

        // Function to edit a task
        this.editTask = function(index, updatedTaskName) {
            if (updatedTaskName) {
                this.tasks[index].name = updatedTaskName;
            }
        };
    }
});

// Task Item Component with Edit and Delete options
app.component('taskItem', {
    bindings: {
        task: '<',
        onDelete: '&',
        onEdit: '&'
    },
    template: `
        <li>
            <span ng-class="{completed: $ctrl.task.completed}">
                <!-- If editing, show input; otherwise, show task name -->
                <span ng-if="!$ctrl.isEditing">{{ $ctrl.task.name }} - <small>Added on: {{ $ctrl.task.timestamp | date:'medium' }}</small></span>
                <input type="text" ng-if="$ctrl.isEditing" ng-model="$ctrl.updatedTask" />

                <!-- Toggle buttons for complete, edit, and delete -->
                <button ng-click="$ctrl.toggleStatus()">{{ $ctrl.task.completed ? 'Undo' : 'Complete' }}</button>
                <button ng-click="$ctrl.startEdit()" ng-if="!$ctrl.isEditing">Edit</button>
                <button ng-click="$ctrl.saveEdit()" ng-if="$ctrl.isEditing">Save</button>
                <button ng-click="$ctrl.cancelEdit()" ng-if="$ctrl.isEditing">Cancel</button>
                <button ng-click="$ctrl.onDelete()">Delete</button>
            </span>
        </li>
    `,
    controller: function() {
        this.isEditing = false; // Flag to track if the task is being edited
        this.updatedTask = '';

        // Toggle the task status between completed and incomplete
        this.toggleStatus = function() {
            this.task.completed = !this.task.completed;
        };

        // Start editing the task
        this.startEdit = function() {
            this.isEditing = true;
            this.updatedTask = this.task.name; // Prefill the input with the current task name
        };

        // Save the updated task name
        this.saveEdit = function() {
            if (this.updatedTask) {
                this.onEdit({ updatedTask: this.updatedTask }); // Trigger the parent edit function
                this.isEditing = false;
            }
        };

        // Cancel editing
        this.cancelEdit = function() {
            this.isEditing = false;
        };
    }
});
