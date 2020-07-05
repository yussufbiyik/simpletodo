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
    height: 700,
    webPreferences:{
      nodeIntegration:true
    }
  });

  mainWindow.loadFile(path.join(__dirname, './pages/index.html'));

  // Open the DevTools.
  // mainWindow.webContents.openDevTools();

  ipcMain.on("load:mainWindow",() => {
    
    var database = JSON.parse(fs.readFileSync(dataPath).toString());
    
    mainWindow.webContents.send("send:todos", database);

  })

  mainWindow.on("close", () => {
    app.quit();
  })

  const appMenu = Menu.buildFromTemplate(appMenuTemplate);
  Menu.setApplicationMenu(appMenu);

  ipcMain.on("groupAdd", () => {
    if(typeof addWindow === 'undefined' || addWindow === null){
      createGroupWindow();
    }
  });

  ipcMain.on("Group:delete",(e, data) => {
    var database = JSON.parse(fs.readFileSync(dataPath).toString());
    database.todos.splice(data, 1);
    fs.writeFile(dataPath,JSON.stringify(database), function(err,result){if(err){console.log(err)}});
    
    mainWindow.reload()
  });

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
    const itemsArray = data.split("|")[1].split(",");
    const groupID = Number(data.split("|")[2]);
    const priority = data.split("|")[3];
    
    currentTODO = database.todos[groupID];
    
    currentTODO.groupName = groupName;
    currentTODO.priority = priority;

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

    currentTODO.items = items;

    fs.writeFile(dataPath,JSON.stringify(database), function(err,result){if(err){console.log(err)}});

    editWindow.close();

    mainWindow.reload();
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
  
  ipcMain.on("Search:target", (e,target) => {
    var database = JSON.parse(fs.readFileSync(dataPath).toString());

    var currentID = 0;
    var results = [];
    var found = false;
    database.todos.some(function(todo) {
      if(todo.groupName.toLowerCase().includes(target.trim().toLowerCase()) || todo.items.toLowerCase().includes(target.trim().toLowerCase())){
        results.push(currentID);
        found = true;
      }
      if(currentID === database.todos.length-1){
        if(found === true){
          setTimeout(function(){
            mainWindow.webContents.send("Search:success", results);
          },100);
        }else{
          setTimeout(function(){
            mainWindow.webContents.send("Search:fail")
          },100)
        }
      }
      currentID++;
    });
  })
};

const appMenuTemplate = [
  {
    label:"App",
    submenu:[
      {
        label: "TODO Groups",
        submenu:[
          {
            label: "Add"
          },
          {
            label: "Edit"
          },
          {
            label: "Delete"
          }
        ]
      },
      {
        label:"Reload",
        role:"reload"
      },
      {
        label:"Close",
        role:"close"
      }
    ]
  },
  {
    label:"Development",
    submenu: [
      {
        label:"DevTools",
        role:"toggleDevTools"
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

function createGroupWindow(){
  addWindow = new BrowserWindow({
    width:500,
    height:515,
    frame:true,
    resizable:true,
    webPreferences:{
      nodeIntegration:true
    },
    autoHideMenuBar:true,
    title:"Add New TODO Group",
  });

  addWindow.loadFile(path.join(__dirname, './pages/addGroup.html'));

  addWindow.on("close", () => {
    addWindow = null;
  });
}

function createEditWindow(){
  editWindow = new BrowserWindow({
    width:500,
    height:515,
    frame:true,
    resizable:true,
    webPreferences:{
      nodeIntegration:true
    },
    autoHideMenuBar:true,
    title:"Edit TODO Group",
  });

  editWindow.loadFile(path.join(__dirname, './pages/editGroup.html'));

  editWindow.on("close", () => {
    editWindow = null;
  });
}