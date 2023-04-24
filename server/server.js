console.clear()
const { Server } = require('socket.io')
const mongoose = require('mongoose')
const Document = require('./document.js')

const uri =
  'mongodb+srv://admin:L3xth1N9LS7B8ugw@cluster0.rplyikv.mongodb.net/?retryWrites=true&w=majority'

const defaultValue = ''

mongoose
  .connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log('connected to db')
  })
  .catch((err) => {
    console.log('err')
  })

const io = new Server(8001, {
  cors: {
    allowedHeaders: '*'
  }
})

io.on('connection', (socket) => {
  socket.on('get-document', async (documentId) => {
    const document = await findOrCreateDocument(documentId)
    socket.join(documentId)

    socket.emit('load-document', document.data)

    socket.on('send-changes', (delta) => {
      socket.broadcast.to(documentId).emit('receive-changes', delta)
    })

    socket.on('save-document', async (data) => {
      await Document.findByIdAndUpdate(documentId, { data })
    })
  })
})

async function findOrCreateDocument(id) {
  if (id == null) return
  const document = await Document.findById(id)

  if (document) return document
  return await Document.create({
    _id: id,
    data: defaultValue
  })
}
