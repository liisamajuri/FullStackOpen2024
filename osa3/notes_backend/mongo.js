const mongoose = require('mongoose')

if (process.argv.length<3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]

const url =
  `mongodb+srv://lmajuri:${password}@notes.xur8qtk.mongodb.net/noteApp?retryWrites=true&w=majority&appName=Notes`

mongoose.set('strictQuery', false)
mongoose.connect(url)

const noteSchema = new mongoose.Schema({
  content: String,
  important: Boolean,
})

const Note = mongoose.model('Note', noteSchema)

const note1 = new Note({
  content: 'HTML is easy',
  important: true,
})

const note2 = new Note({
  content: 'CSS is hard',
  important: true,
})

const note3 = new Note({
  content: 'Mongoose makes things easy',
  important: true,
})


Promise.all([note1.save(), note2.save(), note3.save()])
  .then(() => {
    console.log('All notes saved!')
    return Note.find({})
  })
  .then(result => {
    result.forEach(note => {
      console.log(note)
    })
    mongoose.connection.close()
  })
  .catch(err => {
    console.error(err)
  })