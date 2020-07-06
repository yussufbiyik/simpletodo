const { app, BrowserWindow, ipcMain, Menu } = require('electron');
const path = require('path');
const fs = require('fs');

dataPath = path.join(__dirname, './database/todos.json');


if (require('electron-squirrel-startup')) {
  app.quit();
}

const createWindow = () => {
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 750,
    frame:false,
    webPreferences:{
      nodeIntegration:true,
      enableRemoteModule:true
    },
    icon: path.join(__dirname,'./assets/img/icon.ico')
  });

  mainWindow.loadFile(path.join(__dirname, './pages/index.html'));

  // Open the DevTools.
  //mainWindow.webContents.openDevTools();

  ipcMain.on("load:mainWindow",() => {
    
    var database = JSON.parse(fs.readFileSync(dataPath).toString());
    
    mainWindow.webContents.send("send:todos", database);

  })

  mainWindow.on("close", () => {
    app.quit();
  })

  const appMenu = Menu.buildFromTemplate(appMenuTemplate);
  Menu.setApplicationMenu(appMenu);

  //Add
  ipcMain.on("groupAdd", () => {
    if(typeof addWindow === 'undefined' || addWindow === null){
      createGroupWindow();
    }
  });

  ipcMain.on("Group:add", (e,data) => {
    var database = JSON.parse(fs.readFileSync(dataPath).toString());

    const groupName = data.split("|")[0];
    const itemsArray = data.split("|")[1].split("\n");
    const priorty = data.split("|")[2];

    var items;
    var counter = 0;
    itemsArray.forEach(item => {
      if(item != ""){
        if(counter > 0){
          items = items + `<li>${item.trim()}</li>`;
        }else{
          items = `<li>${item.trim()}</li>`;
        }
        counter++;
      }
    });

    const dataObj = {
      "groupName":groupName.trim(),
      "items":items,
      "priority":priorty
    }

    database.todos.push(dataObj);

    fs.writeFile(dataPath,JSON.stringify(database), function(err,result){if(err){console.log(err)}});

    addWindow.close();

    mainWindow.reload();
  })

  // Delete
  ipcMain.on("Group:delete",(e, data) => {
    var database = JSON.parse(fs.readFileSync(dataPath).toString());
    database.todos.splice(data, 1);
    fs.writeFile(dataPath,JSON.stringify(database), function(err,result){if(err){console.log(err)}});
    
    mainWindow.reload()
  });

  // Finish
  ipcMain.on("Group:finish",(e, data) => {
    var database = JSON.parse(fs.readFileSync(dataPath).toString());
    database.todos[data].priority = " FINISHED"
    fs.writeFile(dataPath,JSON.stringify(database), function(err,result){if(err){console.log(err)}});
    
    mainWindow.reload()
  });

  // Edit
  ipcMain.on("editBtn",(e, data) => {
    if(typeof editWindow === 'undefined' || editWindow === null){
      createEditWindow();
      ipcMain.on("load:editWindow",() => {
        editWindow.webContents.send("targetGroup", data);
      })
    }
  });

  ipcMain.on("Group:edit",(e,data) => {
    var database = JSON.parse(fs.readFileSync(dataPath).toString());

    const groupName = data.split("|")[0];
    const itemsArray = data.split("|")[1].split("\n");
    const groupID = Number(data.split("|")[2]);
    const priority = data.split("|")[3];
    console.log(itemsArray)
    
    currentTODO = database.todos[groupID];
    
    currentTODO.groupName = groupName;
    currentTODO.priority = priority;

    var items;
    var counter = 0;
    itemsArray.forEach(item => {
      if(item != "" || item != ' '){
        if(counter > 0){
          items = items + `<li>${item.trim()}</li>`;
        }else{
          items = `<li>${item.trim()}</li>`;
        }
        counter++;
      }else{
        counter++;
      }
    });

    currentTODO.items = items;

    fs.writeFile(dataPath,JSON.stringify(database), function(err,result){if(err){console.log(err)}});

    editWindow.close();

    mainWindow.reload();
  });

  // Search
  ipcMain.on("Search:target", (e,target) => {
    var database = JSON.parse(fs.readFileSync(dataPath).toString());

    var currentID = 0;
    var results = [];
    var found = false;
    if(database.todos.length != 0){
      database.todos.some(function(todo) {
        if(todo.groupName.toLowerCase().includes(target.trim().toLowerCase()) || todo.items.toLowerCase().includes(target.trim().toLowerCase())){
          results.push(currentID);
          found = true;
        }
        if(currentID === database.todos.length-1){
          if(found === true){
            setTimeout(function(){
              mainWindow.webContents.send("Search:success", results);
            },300);
          }else{
            setTimeout(function(){
              mainWindow.webContents.send("Search:noresult")
            },300)
          }
        }
        currentID++;
      });
    }else{
      setTimeout(function(){
        mainWindow.webContents.send("Search:fail")
      },300)
    }
  })
};

const appMenuTemplate = [
  {
    label:"Controls",
    submenu:[
      {
        label:"Reload",
        role:"reload"
      },
      {
        label:"Close",
        role:"close"
      }
    ]
  }
]


app.on('ready', createWindow);


app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// Create Windows
function createGroupWindow(){
  addWindow = new BrowserWindow({
    width:500,
    height:550,
    frame:false,
    resizable:false,
    webPreferences:{
      nodeIntegration:true,
      enableRemoteModule:true
    },
    autoHideMenuBar:true,
    title:"Add New TODO Group",
    icon: path.join(__dirname,'./assets/img/icon.ico')
  });

  addWindow.loadFile(path.join(__dirname, './pages/addGroup.html'));
  //addWindow.webContents.openDevTools();

  addWindow.on("close", () => {
    addWindow = null;
  });
}

function createEditWindow(){
  editWindow = new BrowserWindow({
    width:500,
    height:550,
    frame:false,
    resizable:false,
    webPreferences:{
      nodeIntegration:true,
      enableRemoteModule:true
    },
    autoHideMenuBar:true,
    title:"Edit TODO Group",
    icon: path.join(__dirname,'./assets/img/icon.ico')
  });

  editWindow.loadFile(path.join(__dirname, './pages/editGroup.html'));
  //editWindow.webContents.openDevTools();

  editWindow.on("close", () => {
    editWindow = null;
  });
}