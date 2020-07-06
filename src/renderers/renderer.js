const { remote,ipcRenderer } = require('electron')

document.querySelector('#minimize').addEventListener("click", () => {
    remote.getCurrentWindow().minimize()
})

document.querySelector('#fullscreen').addEventListener("click", () => {
    const currentWindow = remote.getCurrentWindow()
    if(currentWindow.isMaximized()){
        currentWindow.unmaximize()
    }else{
        currentWindow.maximize()
    }
})

document.querySelector('#quit').addEventListener("click", () => {
    remote.getCurrentWindow().close();
})