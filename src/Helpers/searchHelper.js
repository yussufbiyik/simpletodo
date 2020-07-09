const { ipcRenderer } = electron; 
const path = require('path');
const fs = require('fs');

//* Send a searching request to ipcMain when form is submitted
let form = document.querySelector("#searchForm");
form.addEventListener("submit",() => {
    var target = document.querySelector("#search").value;
    ipcRenderer.send("Search:Target", target);
})

//* When there are no results
ipcRenderer.on("Search:NoResult", () => {
    // Close all notifications and show a new UIkit notification
    UIkit.notification.closeAll();
    UIkit.notification({message:"<span uk-icon='icon: warning'></span> No results",status:"warning"});
});

//* When searching fails
ipcRenderer.on("Search:Fail", () => {
    // Close all notifications and show a new UIkit notification
    UIkit.notification.closeAll();
    UIkit.notification({message:"<span uk-icon='icon: warning'></span> No items to search from",status:"warning"});
});

//* When searching succeeds
ipcRenderer.on("Search:Success", (e, data) => {
    // Get database contents
    var dataPath = path.join(__dirname, '../database/todos.json');
    var database = JSON.parse(fs.readFileSync(dataPath).toString());

    // Close notifications
    UIkit.notification.closeAll();

    // Create a UIkit modal to list results in it
    var results = '<div class="uk-modal-body uk-text-center" uk-grid><button class="uk-modal-close-default uk-text-right" type="button" uk-close></button><div><h2 class="uk-modal-title">Results</h2></div><div></div><div><ul class="uk-nav uk-dropdown-nav"><li class="uk-nav-divider"></li>'
    // Create a list item for every result
    data.forEach(item => {
        results = results + `<li><a href="#todo${item}">${database.todos[item].groupName.toUpperCase()}</a></li><li class="uk-nav-divider"></li>`
    });
    // Show the results in a UIkit dialog
    UIkit.modal.dialog(results + `</ul></div>`);
})