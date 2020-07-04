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
    createGroupWindow()
  });

  ipcMain.on("addGroup:submit", (e,data) => {

    var database = JSON.parse(fs.readFileSync(dataPath).toString());

    const groupName = data.split("|")[0];
    const itemsArray = data.split("|")[1].split(",");
    console.log(itemsArray);

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
      "items":items
    }

    var newDatabase = database.todos.push(dataObj);

    fs.writeFile(dataPath,JSON.stringify(database), function(err,result){if(err){console.log(err)}});

    addGroupWindow.close();

    mainWindow.reload();
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
  addGroupWindow = new BrowserWindow({
    width:500,
    height:280,
    frame:false,
    resizable:false,
    webPreferences:{
      nodeIntegration:true
    },
    autoHideMenuBar:true,
    title:"Add New TODO Group",
  });

  addGroupWindow.loadFile(path.join(__dirname, './pages/addGroup.html'));

  addGroupWindow.on("close", () => {
    addGroupWindow = null;
  });
}