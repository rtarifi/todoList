const nano = require('nano')('http://localhost:5984')
const db = nano.db.use('a')

const async = require('async')

const fs = require('fs')
const path = require('path')

const couchdbDir = path.resolve(__dirname, '../../couchdb')

const docs = []

nano.db.create(db.config.db, (err, body) => {
 if (err) throw err

 fs.readdir(couchdbDir, (err, folders) => {
  if (err) throw err

  async.each(folders, (folder, cb) => {
   let folderPath = path.resolve(couchdbDir, folder)
   let stats = fs.statSync(folderPath)

   if (!stats.isDirectory()) return cb()

   fs.readdir(folderPath, (err, files) => {
    if (err) return cb(err)

    async.each(files, (file, cb) => {
     if (path.extname(file) !== '.json') return cb()

     fs.readFile(path.resolve(folderPath, file), {encoding: 'utf8'}, (err, data) => {
      if (err) return cb(err)

      docs.push(JSON.parse(data))
      cb()
     })
    }, err => {
     db.bulk({docs: docs}, cb)
    })
   })
  }, err => {
   if (err) throw err
   console.log('database is set')
  })
 })
})
