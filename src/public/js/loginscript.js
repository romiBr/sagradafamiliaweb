window.$ = window.jquery = require('jquery');
const electron = require('electron');
const ipc = electron.ipcRenderer


const inputbutton = document.getElementById('inputbutton')

inputbutton.addEventListener('click', function() {
    ipc.send('go-to-masterpage-usuario')
})
