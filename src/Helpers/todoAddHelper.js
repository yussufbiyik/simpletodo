const { ipcRenderer } = electron; 

//* Declare button(s)
let addBtn = document.querySelector("#submit");

//* Declare button functions

// Add Button Function
addBtn.onclick = function() {
    // Get input datas from form elements
    const group = document.querySelector("#groupName").value;
    const items = document.querySelector("#contents").value;
    const priority = document.querySelector("#priority").value;

    // Send form datas to index.js if form is filled; else, show a UIkit notification
    if(group && items){
        ipcRenderer.send("Group:add",`${group} | ${items} | ${priority}`)
    }else{
        UIkit.notification.closeAll();    
        UIkit.notification({message:"<span uk-icon='icon: warning'></span> Please fill the form!",status:'warning'});
    }
}