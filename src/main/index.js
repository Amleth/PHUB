import { app, shell, BrowserWindow, ipcMain } from 'electron'
import fs from 'node:fs'
import path from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import { go, makeFileData, getMD5 } from './phub_process_pdf'

function createWindow() {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      preload: path.join(__dirname, '../preload/index.js'),
      sandbox: false,
      webviewTag: true
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.openDevTools({ mode: 'bottom' })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  const PHUB = path.join(app.getPath('documents'), 'PHUB')
  const FROM = path.join(app.getPath('documents'), 'PHUB/in')
  const TO = path.join(app.getPath('documents'), 'PHUB/pdf')
  const FILES_JSON = path.join(PHUB, 'files.json')
  const filesPathsOnDrive = go(PHUB, FROM, TO)
  const filesMd5OnDrive = filesPathsOnDrive.map(getMD5)
  if (!fs.existsSync(FILES_JSON)) {
    fs.writeFileSync(FILES_JSON, JSON.stringify([]))
  }
  const filesDataInJson = JSON.parse(fs.readFileSync(FILES_JSON), 'utf8')
  const filesDataInJsonByMd5 = Object.fromEntries(filesDataInJson.map((x) => [x.md5, x]))
  const filesData = []

  // Exclude non existing files
  for (const md5 in filesDataInJsonByMd5) {
    if (!filesMd5OnDrive.includes(md5)) {
      delete filesDataInJsonByMd5[md5]
    }
  }

  filesPathsOnDrive.map((x) => {
    const md5 = getMD5(x)
    // Detect new files
    if (!(md5 in filesDataInJsonByMd5)) {
      filesData.push(makeFileData(x, md5))
    }
    // Include already declared files
    else {
      filesData.push(filesDataInJsonByMd5[md5])
    }
  })

  ipcMain.handle('fetch-files', () => filesData)

  ipcMain.on('persist-files', (event, payload) => {
    fs.writeFileSync(FILES_JSON, JSON.stringify(payload))
  })

  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
