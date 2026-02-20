const { log } = require('console');
const fs = require('fs')
const path = require('path')

const tasksFilePath = path.join(__dirname, "Task.json");

const readTasks = () => {
    if (fs.existsSync(tasksFilePath)) {
        const data = fs.readFileSync(tasksFilePath, "utf-8");
        return JSON.parse(data);
    }
    return [];
}

const writeTask = (tasks) => {
    fs.writeFileSync(
        tasksFilePath,
        JSON.stringify(tasks, null, 2),
        'utf-8'
    )
}

const getNextId = (tasks) => {
    const ids = tasks.map((task) => task.id);
    ids.sort((a, b) => a - b);
    let nextId = 1
    for (let id of ids) {
        if (id !== nextId) break;
        nextId += 1;
    }
    return nextId;
}

const addTask = (description) => {
    const tasks = readTasks();
    const newTask = {
        id: getNextId(tasks),
        description: description,
        completed: false,
        inProgress: false
    };
    tasks.push(newTask);
    writeTask(tasks)
    console.log(`Task added successfully! (ID: ${newTask.id})`)
}

const listTask = (status) => {
    const tasks = readTasks();
    let filteredTasks = tasks;
    if (status) {
        if (status.toLowerCase() === 'done') {
            filteredTasks = tasks.filter((task) => task.completed);
        }
        else if (status.toLowerCase() === 'to-do') {
            filteredTasks = tasks.filter(
                (task) => !task.completed && !task.inProgress
            );
        }
        else if (status.toLowerCase() === 'in-progress') {
            filteredTasks = tasks.filter(
                (tasks) => task.inProgress
            )
        }
        else {
            console.log('Invalid Status code (Use done, to-do, or in-progress)')
        }
    }
    if (filteredTasks.length == 0) {
        console.log("No tasks found.")
    }
    else {
        console.log(`Listing ${status ? status : "all"} tasks`)
        filteredTasks.forEach((task) => {
            console.log(
                `${task.id}. ${task.description} [${task.completed? 'Done': task.inProgress? 'In-progress': 'To-Do'}]`
            )
        })
    }
}

const deleteTask = (id)=>{
    const tasks = readTasks()
    const newTasks = tasks.filter((task)=>task.id !== parseInt(id))
    if(newTasks.length<tasks.length){
        writeTask(newTasks)
        console.log(`Task Id ${id} is deleted successfully`)
    }
    else
        console.log(`Task Id ${id} is not found`);
            
}
const updateTask = (id,description)=>{
    const tasks = readTasks()
    const task = tasks.find((task)=>task.id == parseInt(id))
    if(task){
        task.description=description
        writeTask(tasks)
        console.log(`Task id ${id} is successfully updated`)
    }
    else
        console.log(`Task id ${id} not found`)
}

const markInProgress = (id)=>{
    const tasks = readTasks()
    const task = tasks.find((task)=>task.id == parseInt(id))
    if(task){
        task.inProgress=true
        task.completed = false
        writeTask(tasks)
        console.log(`Task id ${id} is marked as in-progress`)
    }
    else
        console.log(`Task id ${id} not found`)
}

const markDone = (id)=>{
    const tasks = readTasks()
    const task = tasks.find((task)=>task.id == parseInt(id))
    if(task){
        task.inProgress=false
        task.completed = true
        writeTask(tasks)
        console.log(`Task id ${id} is marked as Done`)
    }
    else
        console.log(`Task id ${id} not found`)
}

const arg = process.argv.slice(2)

console.log(arg.slice(1).join(" "))

if (arg[0] == 'add') {
    const taskDescription = arg.slice(1).join(" ")
    if (!taskDescription) {
        console.log("Please provide a valid task description");
    }
    else {
        addTask(taskDescription)
    }
}
else if (arg[0] == 'list') {
    const status = arg[1];
    listTask(status)
}
else if (arg[0] == 'delete') {
    const id = arg[1]
    if (!id) {
        console.log("enter a valid id")
    }
    else
        deleteTask(id)
}
else if (arg[0] == 'update') {
    const id = arg[1]
    const newDescription = arg.slice(2).join(" ")
    if (!id || !newDescription) {
        console.log("enter a valid id or description")
    }
    else
        updateTask(id, newDescription)
}
else if( arg[0]=='mark-in-progress'){
    const id = arg[1]
    if(!id)
        console.log("enter a valid id")
    else
        markInProgress(id)
}
else if(arg[0]=='mark-done'){
    const id = arg[1]
    if(!id)
        console.log("enter a valid id")
    else
        markDone(id)
}
else{
        console.log(
    "Usage: node index.js <command> [arguments]"
  );
  console.log("Commands:");
  console.log(
    "  add <task description>            - Add a new task"
  );
  console.log(
    "  list [status]                     - List tasks (status: done, to-do, in-progress)"
  );
  console.log(
    " update <id> <new description>     - Update a task by ID"
  );
  console.log(
    " delete <id>                       - Delete a task by ID"
  );
  console.log(
    " mark-in-progress <id>             - Mark a task as in-progress by ID"
  );
  console.log(
    " mark-done <id>                    - Mark a task as done by ID"
  );
}