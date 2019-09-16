const errors = require('restify-errors');

const nano = require('nano')('http://localhost:5984')
const db = nano.db.use('todo')


module.exports.list = (req, res, next) => {
 if (!req.auth || !req.auth.id) return next(new errors.UnauthorizedError('credentials required'))

 const profileId = req.auth.id

 db.view('task', 'by_created_time', {
  startkey: [profileId, {}],
  endkey: [profileId],
  descending: true,
  include_docs: true
 }, (err, body) => {
  if (err) return next(new errors.InternalError('internal error'))

  res.send(body)
  next()
 })
}

module.exports.get = (req, res, next) => {
 const {id} = req.params 

 if (!req.auth || !req.auth.id) return next(new errors.UnauthorizedError('credentials required'))

 db.get(id, (err, doc) => {
  if (err) return next(err)

  if (doc.profileId !== req.auth.id) return next(new errors.UnauthorizedError('unauthorized request'))

  res.send(doc)
  next()
 })
}

module.exports.create = (req, res, next) => {
 if (!req.auth || !req.auth.id) return next(new errors.UnauthorizedError('credentials required'))

 const profileId = req.auth.id
 const {title} = req.params
 const time = new Date().toISOString()

 if (!title) return next(new errors.MissingParameterError('missing task!'))

 const data = {
  type: 'task',
  title: title,
  profileId: profileId,
  completed: false,
  time: {
   created: time,
   modified: time
  }
 }

 db.insert(data, (err, result) => {
  if (err) return next(err)

  if (!result || !result.id) return next(new errors.InternalError('did not create task'))

  data._id = result.id
  res.send({ success: true, doc: data })
  next()
 })
}

module.exports.update = (req, res, next) => {
 if (!req.auth || !req.auth.id) return next(new errors.UnauthorizedError('credentials required'))

 const {title, completed, id} = req.params
 const profileId = req.auth.id
 
 if (!id || (!title && completed === undefined)) return next(new errors.MissingParameterError('missing parameter to update'))

  db.get(id, (err, doc) => {
  if (err) return next(err)

  if (profileId !== doc.profileId) return next(new errors.UnauthorizedError('unauthorized request'))

  if (title) doc.title = title
  if (completed !== undefined) doc.completed = completed

   doc.time.modified = new Date().toISOString()

   db.insert(doc, (err, result) => {
    if (err) return next(err)

    res.send({ success: true, doc})
    next()
   })
 })
}

module.exports.delete = (req, res, next) => {
 if (!req.auth || !req.auth.id) return next(new errors.UnauthorizedError('credentials required'))

 const {id} = req.params

 db.get(id, (err, doc) => {
  if (err) return next(err)

  if (req.auth.id !== doc.profileId) return next(new errors.UnauthorizedError('unauthorized request'))

  doc._deleted = true
  db.insert(doc, (err, insert) => {
   if (err) return next(err)

   res.send({success: true})
   next()
  })
 })
}
