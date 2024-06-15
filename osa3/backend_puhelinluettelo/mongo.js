const mongoose = require('mongoose')

if (process.argv.length<3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]

const url =
  `mongodb+srv://lmajuri:${password}@phonebook.s5gwpg8.mongodb.net/phonebookApp?retryWrites=true&w=majority&appName=Phonebook`

mongoose.set('strictQuery', false)
mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

const personName = process.argv[3]
const personNumber = process.argv[4]

const createPerson = () =>{
  const person = new Person({
    name: personName,
    number: personNumber,
  })
  return person
}

const savePerson = (person) => {
  person.save()
  .then(() => {
    console.log(`Added ${person.name} number ${person.number} to phonebook!`)
    mongoose.connection.close()
  })
  .catch(err => {
    console.error(err)
  })
}

const getAll = () => {
  Person
    .find({})
    .then(result => {
      console.log("Phonebook:")
      result.forEach(person => {
        console.log(person.name, person.number)
      })
      mongoose.connection.close()
    })
    .catch(err => {
      console.error(err)
    })
}

if (personName) {
  const newPerson = createPerson()
  savePerson(newPerson)
} else {
  getAll()
}

