import crypto from 'crypto'
import * as fs from 'node:fs'
import path from 'path'

function getHash(p) {
  return new Promise((resolve, reject) => {
    const hash = crypto.createHash('md5')
    const rs = fs.createReadStream(p)
    rs.on('error', reject)
    rs.on('data', (chunk) => hash.update(chunk))
    rs.on('end', () => resolve(hash.digest('hex')))
  })
}

function go() {
  try {
    const dirents = fs.readdirSync('./library/in', {
      recursive: true,
      withFileTypes: true
    })
    for (const dirent of dirents) {
      const direntFullPath = path.join(dirent.parentPath, dirent.name)
      if (path.extname(direntFullPath) === '.pdf') {
        ;(async () => {
          const hashValue = await getHash(direntFullPath)
          fs.copyFileSync(
            direntFullPath.toString(),
            path.join('library/pdf', hashValue + '.pdf').toString()
          )
          fs.unlinkSync(direntFullPath)
        })()
      }
    }
  } catch (err) {
    console.log(err)
  }
}

export default go
