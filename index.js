const { app, BrowserWindow, shell, Menu , globalShortcut, ipcMain} = require('electron');
const menus = require('./menu');
const touchBar = require('./touchbar');

function createWindow(){
  let window = new BrowserWindow({
    width: 800,
    height: 600,
    minHeight: 300,
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true
    }
  })

  window.loadFile('index.html')
  window.setTouchBar(touchBar)
}
// app.whenReady().then(() => {
//   const qt = globalShortcut.register('CommandOrControl+Q', () => {
//     console.log('pressed')
//   })

//   if(!qt) console.log("registration failed")

//   console.log(globalShortcut.isRegistered(`CommandOrControl+Q`), "Q exeisr")
// })

app.on('ready', () => {
  createWindow()
  console.log(app.getName())

  // globalShortcut.register('CommandOrControl+S', () => {
  //   const window = BrowserWindow.getFocusedWindow()
  //   window.webContents.send('editor-event', 'save')
  // })
  // console.log(Menu.getApplicationMenu())
  // let a = globalShortcut.register('CommandOrControl+Q', () => {
  //   // app.quit()
  //   console.log('Q was pressed')
  // })
  // if(!a) console.log('not a')

  // console.log(globalShortcut.isRegistered('CommandOrControl+Q'))
})


app.on('will-quit', () => {
  // Unregister a shortcut.
  // globalShortcut.unregister('CommandOrControl+X')

  // Unregister all shortcuts.
  globalShortcut.unregisterAll()
})
Menu.setApplicationMenu(menus)