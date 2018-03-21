const { app, BrowserWindow, Menu } = require('electron')
const path = require('path')
const url = require('url')
const fs = require('fs')
let win

const template = [{
  label: 'Edit',
  submenu: [{
    role: 'undo'
  },
    {
      role: 'redo'
    },
    {
      type: 'separator'
    },
    {
      role: 'cut'
    },
    {
      role: 'copy'
    },
    {
      role: 'paste'
    },
    {
      role: 'pasteandmatchstyle'
    },
    {
      role: 'delete'
    },
    {
      role: 'selectall'
    }
  ]
},
  {
    label: 'View',
    submenu: [{
      label: 'Reload',
      accelerator: 'CmdOrCtrl+R',
      click(item, focusedWindow) {
        if (focusedWindow) focusedWindow.reload()
      }
    },
      {
        type: 'separator'
      },
      {
        role: 'resetzoom'
      },
      {
        role: 'zoomin'
      },
      {
        role: 'zoomout'
      },
      {
        type: 'separator'
      },
      {
        role: 'togglefullscreen'
      }
    ]
  },
  {
    role: 'window',
    submenu: [{
      role: 'minimize'
    },
      {
        role: 'close'
      }
    ]
  },
  {
    role: 'help',
    submenu: [{
      label: 'Learn More',
      click() {
        require('electron').shell.openExternal('https://electron.atom.io')
      }
    }]
  }
]

if (process.platform === 'darwin') {
  template.unshift({
    label: 'Stackedit',
    submenu: [{
      role: 'about'
    },
      {
        type: 'separator'
      },
      {
        role: 'services',
        submenu: []
      },
      {
        type: 'separator'
      },
      {
        role: 'hide'
      },
      {
        role: 'hideothers'
      },
      {
        role: 'unhide'
      },
      {
        type: 'separator'
      },
      {
        role: 'quit'
      }
    ]
  })
  // Edit menu.
  template[1].submenu.push({
    type: 'separator'
  }, {
    label: 'Speech',
    submenu: [{
      role: 'startspeaking'
    },
      {
        role: 'stopspeaking'
      }
    ]
  })
  // Window menu.
  template[3].submenu = [{
    label: 'Close',
    accelerator: 'CmdOrCtrl+W',
    role: 'close'
  },
    {
      label: 'Minimize',
      accelerator: 'CmdOrCtrl+M',
      role: 'minimize'
    },
    {
      label: 'Zoom',
      role: 'zoom'
    },
    {
      type: 'separator'
    },
    {
      label: 'Bring All to Front',
      role: 'front'
    }
  ]
}

function createWindow () {
  win = new BrowserWindow({
    transparent: true,
    frame: false,
    width: 800,
    height: 600,
    icon: path.join(__dirname, 'assets/icons/png/64x64.png'),
    webPreferences: {
      nodeIntegration: false
    }
  })
  win.loadURL('https://stackedit.io/app/#')
  win.webContents.on('did-finish-load', function () {
    fs.readFile(__dirname + '/assets/styles/style.css', 'utf-8', function (error, data) {
      if (!error) {
        var formatedData = data.replace(/\s{2,10}/g, ' ').trim()
        win.webContents.insertCSS(formatedData)
      }
    })
  })

  Menu.setApplicationMenu(Menu.buildFromTemplate(template))
}

app.on('ready', createWindow)
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
app.on('activate', () => {
  if (win === null) {
    createWindow()
  }
})
