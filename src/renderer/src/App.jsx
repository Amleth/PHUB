import { useAtom } from 'jotai'
import { useState } from 'react'
import Files from './Files'
import File from './File'
import Bookmarks from './Bookmarks'
import { filesAtom } from './store'

const SCREEN_FILES = 0
const SCREEN_FILE = 1
const SCREEN_BOOKMARKS = 2

function App() {
  const [screen, setScreen] = useState(SCREEN_FILES)
  const [allFiles, setAllFiles] = useAtom(filesAtom)
  const [selectedFile, setSelectedFile] = useState()

  return (
    <div>
      <div className="flex">
        <div
          className="p-4 select-none"
          onClick={() => window.electron.ipcRenderer.send('persist-files', allFiles)}
        >
          SAVE
        </div>
        <div className="p-4 select-none" onClick={() => setScreen(SCREEN_FILES)}>
          FILES
        </div>
        <div className="p-4 select-none" onClick={() => setScreen(SCREEN_FILE)}>
          FILE
        </div>
        <div className="p-4 select-none" onClick={() => setScreen(SCREEN_BOOKMARKS)}>
          BOOKMARKS
        </div>
      </div>
      <hr />
      {screen === SCREEN_BOOKMARKS && <Bookmarks />}
      {screen === SCREEN_FILES && <div className="p-4"><Files clickCallback={(file) => {
        setSelectedFile(file)
        setScreen(SCREEN_FILE)
      }} /></div>}
      {screen === SCREEN_FILE && <div className="p-4"><File file={selectedFile} /></div>}
    </div>
  )
}

export default App
