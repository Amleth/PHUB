import { useAtom } from 'jotai'
import { filesAtom } from './store'

function Files({ clickCallback }) {
  const [allFiles, setAllFiles] = useAtom(filesAtom)

  return (
    <div>
      <ul>
        {allFiles.map((file) => (
          <li className="select-none" key={file.md5} onClick={() => clickCallback(file)}>
            {file.title || file.name}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default Files
