import { useAtom } from 'jotai'
import { useState } from 'react'
import { setPdf } from './pdf'
import { filesAtom } from './store'

function File({ file }) {
  const [allFiles, setAllFiles] = useAtom(filesAtom)

  setPdf(file.path)

  function updateStore(title) {
    setAllFiles((allFiles) =>
      allFiles.map((x) => (x.md5 === file.md5 ? { ...x, title } : x))
    )

    window.electron.ipcRenderer.send('persist-files', allFiles)
  }

  return <div>
    <div className="flex">
      <div className="w-full">
        TITRE
        <input
          className="mb-4 w-full"
          defaultValue={file.title}
          onChange={e => {
            updateStore(e.target.value)
          }}
        ></input>
      </div>
    </div>
  </div>
}

export default File