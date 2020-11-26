const { Menu, shell, app, ipcMain, BrowserWindow, globalShortcut, dialog} = require('electron');
const fs = require('fs');
const util = require('util');
const  writeFile   = util.promisify(fs.writeFile)
const  readFile   = util.promisify(fs.readFile)
const isMac = process.platform === "darwin"


function saveFile(){
  console.log('Saving the file')
  const window = BrowserWindow.getFocusedWindow()
  window.webContents.send('editor-event', 'save')
}

async function loadFile(){
  const window = BrowserWindow.getFocusedWindow()
  const options = {
    title: 'pick a markdown file',
    filters: [
      {name: 'markdown files', extensions: ['md']},
      {name: 'txt files', extensions: ['txt']}
    ]
  }
  let open = await dialog.showOpenDialog(window, options)
  let file = await readFile(open.filePaths[0], 'utf8');
  window.webContents.send('load', {content: file, name: open.filePaths[0]})
}

const template = [
{
  label: 'File',
  submenu: [
    {
      label: 'save',
      accelerator: 'CommandOrControl+S',
      click: () => saveFile()
    },
    { 
      label: 'open',
      accelerator: 'CommandOrControl+O',
      click: () => loadFile()

    }
  ]
},
{ 
  role: 'help',
  submenu: [{    
    label: 'About editor Component',
    click(){
      shell.openExternal('https://simplemde.com/')
    }
  }]
},
{
  label: 'format',
  submenu: [
    {
      label: `toggle blod`,
      click(){
        const window = BrowserWindow.getFocusedWindow()
        window.webContents.send('editor-event', 'toggle-bold')
      }
    }
  ]
}
]

if(process.env.DEBUG){
  template.push({
    label: "DEBUGGING",
    submenu: [{
      label: 'Dev Tools',
      role: 'toggleDevTools'
    },{type: 'separator'}
  ,{
    role: 'reload',
    accelerator: 'CommandOrControl+R'
  }]

  })
}


if(isMac){
  template.unshift({
    label: app.getName(),
    submenu: [
      {role: 'about'},
      {type: 'separator'},
      {role: 'quit'},
      {role: 'close'},
      {role: 'zoomIn'},
      {role: 'zoomOut'},
    ]
  })
}


app.whenReady().then(() => {
  // Register a 'CommandOrControl+Y' shortcut listener.
  globalShortcut.register('CommandOrControl+S', () => {
    saveFile()
  })

  globalShortcut.register('CommandOrControl+O', async () => {
    // show open dialog
    await loadFile()
  })
})

ipcMain.on('editor-reply', (event, arg) => {
  console.log('received from th web page -> ' + JSON.stringify(arg))

})

ipcMain.on('save', async (event, arg) => {
  console.log('saving content of the file ' )
  console.log( arg.value)
  const window = BrowserWindow.getFocusedWindow()
    const options = {
      title: 'Save markdown file',
      filters: [{name: 'MyFile', extensions:['md'] }]
    }
 let filename = await dialog.showSaveDialog(window, options)
 if(filename && filename.filePath && filename.canceled === false){
   console.log('Saving content to the file -> ' + arg.value)
   await writeFile(filename.filePath, arg.value)
 }
    console.log('LMAOAOAOAOAOOAAO ->',filename)
})



const menus = Menu.buildFromTemplate(template)

module.exports = menus
