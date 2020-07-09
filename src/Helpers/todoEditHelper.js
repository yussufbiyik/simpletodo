const { ipcRenderer } = electron; 
const path = require('path');
const fs = require('fs');

//* Declare buttons
let accptBtn = document.querySelector("#submit");

//* Get database contents
dataPath = path.join(__dirname, '../database/todos.json');
var database = JSON.parse(fs.readFileSync(dataPath).toString());
var dataID;

//* Send a message to ipcMain to get details of target group
window.onload = function(){
    ipcRenderer.send("Load:editWindow");
}

//* Declare todoItems variable to avoid using the same code twice
var todoItems;

//* When target group details arrive, set the form values with relevant target group values
ipcRenderer.on("Send:TargetGroup", (e, data) => {
    // Set the dataID as data to use it later 
    dataID = data;
    //* Use regex to replace HTML tags with line breaks & ''s and set the result as todoItems
    todoItems = database.todos[data].items.replace(/<li>/gm,'').replace(/<\/li>/gm,'\n');
    document.querySelector("#groupName").value = database.todos[data].groupName;
    document.querySelector("#contents").value = todoItems;
    document.querySelector("#priority").value = database.todos[data].priority.trim()
});

//* Check the form and if it's not empty or same, update database; else, show the relevant UIkit notification
accptBtn.onclick = function() {
    // Get form values and set to variables
    const group = document.querySelector("#groupName").value;
    const items = document.querySelector("#contents").value;
    const priority = document.querySelector("#priority").value;
    // Check if form is empty or not
    if(group || items){
        // Check if form is changed
        if(group === database.todos[dataID].groupName && items === todoItems && priority === database.todos[dataID].priority.trim()){
            // If form has no changes
            UIkit.notification.closeAll();    
            UIkit.notification({message:"<span uk-icon='icon: warning'></span> No changes made!",status:'warning'});
        }else{
            // If form has changes
            ipcRenderer.send("Group:edit",`${group.trim()} | ${items.trim()} | ${dataID} | ${priority.trim()}`)
        }
    }else{
        // If form is empty
        UIkit.notification.closeAll();    
        UIkit.notification({message:"<span uk-icon='icon: warning'></span> Form is empty!",status:'warning'});
    }
}