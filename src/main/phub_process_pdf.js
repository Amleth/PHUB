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

function go(phub, from, to) {
  try {

    // COPY PDF IN "FROM" TO "TO"
    const dirents = fs.readdirSync(from, { recursive: true, withFileTypes: true })
    for (const dirent of dirents) {
      const direntFullPath = path.join(dirent.parentPath, dirent.name)
      if (path.extname(direntFullPath) === '.pdf') {
        (async () => {
          const hashValue = await getHash(direntFullPath)
          fs.copyFileSync(
            direntFullPath.toString(),
            path.join(to, hashValue + '.pdf').toString()
          )
          fs.unlinkSync(direntFullPath)
        })()
      }
    }

    // LIST PDF IN "TO"
    const files = []
    const direntsTo = fs.readdirSync(to, { withFileTypes: true })
    for (const dirent of direntsTo) {
      const direntFullPath = path.join(dirent.parentPath, dirent.name)
      if (path.extname(direntFullPath) === '.pdf') {
        files.push(direntFullPath)
      }
    }
    return files
  } catch (err) {
    console.log(err)
  }
}

function makeFileData(path, md5) {
  return ({
    md5: md5,
    name: md5 + '.pdf',
    title: md5,
    path
  })
}

function getMD5(path) {
  return path.split('/').slice(-1)[0].split('.')[0]
}

export { go, makeFileData, getMD5 }
