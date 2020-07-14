const { ipcRenderer } = electron; 

//* When TODOs are recieved
ipcRenderer.on("Send:TODOs", (e, data) => {
    if(document.querySelector('#pageTitle').innerHTML === 'home'){
        // Check if there are TODOs
        if(data.todos.length === 0){
        }else{
            var counter = 0;
            data.todos.forEach(todo => {
                // Select todo lists
                let todoList = document.querySelector("#todoList");
                let todoMenuList = document.querySelector("#todomenulist");
                
                // Generate HTML output
                let todoAsHTML = 
                `<li class="${todo.priority}">
                <div id='todo${counter}'>
                <div class='uk-card uk-card-default uk-card-hover uk-text-left'>
                <div class='uk-card-header'>
                <div class="uk-card-badge uk-label">${todo.priority}</div>
                <h3 class='uk-card-title'>
                ${todo.groupName}
                </h3>
                </div>
                <div class='uk-card-body'>
                <ul class='uk-list uk-list-striped'>
                ${todo.items}
                </ul>
                <div class='uk-align-right'>
                <a onclick='fnshBtn(${counter})' id='fnshBtn' class='uk-icon-button button-success uk-margin-small-right' uk-icon='check'></a> 
                <a onclick='editBtn(${counter})' id='editBtn' class='uk-icon-button uk-button-primary uk-margin-small-right' uk-icon='pencil'></a>
                <a onclick='delBtn(${counter})' id='delBtn' class='uk-icon-button uk-button-danger' uk-icon='trash'></a>                        
                </div>                  
                </div>
                </div>
                </div>
                </li>`;

                // Fill the todo list
                todoList.innerHTML = todoList.innerHTML + todoAsHTML;

                // Fill the hidden left menu todolist
                todoMenuList.innerHTML = todoMenuList.innerHTML + `<li><a class="uk-text-capitalize" href="#todo${counter}">${todo.groupName}</a></li>`; 

                counter++;
            });
        }
    }
    if(document.querySelector('#pageTitle').innerHTML === 'homePrintable'){
        // Check if there are TODOs
        if(data.todos.length === 0){
        }else{
            var counter = 0;
            data.todos.forEach(todo => {
                // Select todo lists
                let todoList = document.querySelector("#todoList");
                
                // Generate HTML output
                let todoAsHTML = 
                `<li class="${todo.priority}">
                <div>
                <div class='uk-card uk-text-left'>
                <div class='uk-card-header'>
                <div class="uk-card-badge uk-label">${todo.priority}</div>
                <h3 class='uk-card-title'>
                ${todo.groupName}
                </h3>
                </div>
                <div class='uk-card-body'>
                <ul class='uk-list uk-list-striped'>
                ${todo.items}
                </ul>                
                </div>
                </div>
                </div>
                </li>
                <div><hr></div>`;

                // Fill the todo list
                todoList.innerHTML = todoList.innerHTML + todoAsHTML;

                counter++;
            });
        }
    }
});