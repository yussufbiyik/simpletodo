const { ipcRenderer, webContents } = electron; 
const path = require('path');
const fs = require('fs');

if (document.addEventListener) {
    document.addEventListener("contextmenu", function (e) {
        toggleContextMenu("context-menu-0","open", e);
        e.preventDefault();
    }, false);
    
    document.addEventListener("click", function (e) {
        toggleContextMenu("context-menu-0","close", e);
        e.preventDefault();
    }, false);
} else {
    document.attachEvent("oncontextmenu", function () {
        toggleContextMenu("context-menu-0","open", e);
        window.event.returnValue = false;
    });
    
    document.addEventListener("click", function (e) {
        toggleContextMenu("context-menu-0","close", e);
        e.preventDefault();
    }, false);
}

function toggleContextMenu(id,action, e) {
    let menu = document.getElementById(id);

    if(action === "open"){
        if (menu.classList.contains("context-menu-open")) {
            menu.classList.add("context-menu-close");
            menu.classList.remove("context-menu-open");
            menu.classList.remove("context-menu-close");
        } else {
            menu.style.left = e.pageX + 8 + "px";
            menu.style.top  = e.pageY + 8 + "px";
            menu.classList.add("context-menu-open");
        }
    }
    if(action === "close"){
        if (menu.classList.contains("context-menu-open")) {
            menu.classList.add("context-menu-close");
            menu.classList.remove("context-menu-open");
            menu.classList.remove("context-menu-close");
        }
    }
}

let printBtn = document.querySelector("#context-item-print")
let exportBtn = document.querySelector("#context-item-export")

//* Printing TODOs
printBtn.addEventListener("click",function(){
    dataPath = path.join(__dirname, '../database/todos.json');
    var database = JSON.parse(fs.readFileSync(dataPath).toString());

    // Show UIkit notification if there are no todos
    if(database.todos.length === 0){
        UIkit.notification.closeAll();
        UIkit.notification({message:"<span uk-icon='icon: warning'></span> No items to print",status:"warning"})
    }else{
        // Go to printable home page
        ipcRenderer.send("Go:HomePrintable")
    }
})

//* Exporting TODOs as a CSV file
exportBtn.addEventListener("click",function(){
    // Get database contents
    dataPath = path.join(__dirname, '../database/todos.json');
    var database = JSON.parse(fs.readFileSync(dataPath).toString());
    var exportableDatabase = `"Group Name";"TODOs";"Priority"`
    // Create a loop for every data in database
    database.todos.forEach(data => {
        // Delete li tags
        data.items = data.items.replace(/<li>/gm,'').replace(/<\/li>/gm,'\n');
        // Create a csv line to add the exportable database
        let data2csv = `"${data.groupName}";"${data.items}";"${data.priority}"`
        exportableDatabase = exportableDatabase + `\n${data2csv}`
    });
    uriContent = "data:text/csv;charset=utf-8," + encodeURIComponent(exportableDatabase);
    var downloader = document.createElement('a');
    downloader.download = "Exported Todos.csv";
    downloader.href = uriContent;
    downloader.click()
})