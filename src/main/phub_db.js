// import * as fs from 'node:fs'
// import path from 'path'
// import Database from 'better-sqlite3'

// class PhubDb {
//   constructor(f) {
//     const db = new Database(f)
//     db.pragma('journal_mode = WAL')

//     this.db = db
//   }

//   getFile(md5) {
//     const row = this.db.prepare(`SELECT md5, title, year FROM files WHERE md5 = ?`).get(md5)
//     if (!row) {
//       this.db.prepare(`INSERT INTO files (md5) VALUES (?)`).run(md5)
//     }
//   }

//   feed(from) {
//     const dirents = fs.readdirSync(from, {
//       recursive: true,
//       withFileTypes: true
//     })
//     for (const dirent of dirents) {
//       const direntFullPath = path.join(dirent.parentPath, dirent.name)
//       const md5 = dirent.name.split('.')[0]
//       this.getFile(md5)
//     }
//   }
// }

// export default PhubDb
