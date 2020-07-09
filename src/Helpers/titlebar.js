const { remote } = require('electron')

//* Minimize current window when button with the id "minimize" is clicked
document.querySelector('#minimize').addEventListener("click", () => {
    remote.getCurrentWindow().minimize()
});

//* Close current window when button with the id "quit" is clicked
document.querySelector('#quit').addEventListener("click", () => {
    remote.getCurrentWindow().close();
});

//* maximize the current window when button with the id "fullscreen" is clicked and if it exists
//! Using this in other windows(addWindow & editWindow) causes those windows to maximize and never minimize again, so don't use this in them. That's why the if statement checks existence of button
if(document.querySelector("#fullscreen")){
    document.querySelector('#fullscreen').addEventListener("click", () => {
        var currentWindow = remote.getCurrentWindow();
        if(currentWindow.isMaximized()){
            currentWindow.unmaximize()
        }else{
            currentWindow.maximize()
        }
    });
}
