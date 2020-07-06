const { remote } = require('electron')

document.querySelector('#minimize').addEventListener("click", () => {
    remote.getCurrentWindow().minimize()
});

document.querySelector('#quit').addEventListener("click", () => {
    remote.getCurrentWindow().close();
});

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
