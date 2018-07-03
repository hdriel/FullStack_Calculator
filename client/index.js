process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = true;
const {app , BrowserWindow, globalShortcut, net} = require('electron');
const url = require('url');


let win = null
function boot() {
    win = new BrowserWindow({
        width: 500,
        height: 600,
        frame: false,
        resizable : false,
        transparent: true
    });
    
    win.loadURL(`file://${__dirname}/index.html`);

    win.on('closed', _ => { 
        console.log("Calculator windows was closed.") 
        win = null;
    });
    
    globalShortcut.register('Alt+Q', () => {
        console.log('key pressed!')
        win.close()
    });
}

app.on('ready', boot);