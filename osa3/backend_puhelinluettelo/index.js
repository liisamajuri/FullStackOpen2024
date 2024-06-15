require('dotenv').config()
const cors = require('cors')
const express = require('express')
const morgan = require('morgan')
const app = express()
const Person = require('./models/person')

app.use(express.json())
app.use(cors())
app.use(express.static('dist'))

morgan.token('body', (req) => {
  if (req.method === 'POST' && req.body) {
    return JSON.stringify(req.body)
  }
  return ''
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

/*
let persons = [
  {
    "id": 1,
    "name": "Arto Hellas",
    "number": "040-123456"    
  },
  {
    "id": 2,
    "name": "Ada Lovelace",
    "number": "39-44-5323523"    
  },
  {
    "id": 3,
    "name": "Dan Abramov",
    "number": "12-43-234345"    
  },
  {
    "id": 4,
    "name": "Mary Poppendieck",
    "number": "39-23-6423122" 
  }
]
*/  


app.get('/', (request, response) => {
  response.send('<h1>Puhelinluettelo</h1>')
})

app.get('/info', (request, response) => {
  Person.find({}).then(persons => {
    const count = persons.length
    const text = `Phonebook has info for ${count} people`
    const date = new Date().toString()
    response.send(
      `<p>${text}<br><br>${date}</p>`
    )
  })
})

const getAll = () => {
  Person
    .find({})
    .then(result => {
      console.log("Phonebook:")
      result.forEach(person => {
        console.log(person.name, person.number)
      })
    })
    .catch(err => {
      console.error(err)
    })
}

app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons)
  })
  getAll()
})



app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  console.log(id)
  // const person = persons.find(person => person.id === id)
  Person.findById(id).then(person => {
    if (person) {
      response.json(person)
    } else {
      response.status(404).end()
    }
  })
})

app.delete('/api/persons/:id', (request, response) => {
  Person.findByIdAndRemove(request.params.id)
    .then(response => {
      response.status(204).end()
    })
})

const getRandomInt = (max) => {
  return Math.floor(Math.random() * max);
}

const generateId = () => {
  const randomId = getRandomInt(1000);
  const idArray = persons.map(n => n.id);
  
  if (idArray.includes(randomId)) {
    return generateId();
  } else {
    return randomId;
  }
}

app.post('/api/persons', (request, response) => {
  const body = request.body
  //console.log(body)

  // const nameList = persons.map(n => n.name);
  //console.log(nameList)

  if (!body.name) {
    return response.status(400).json({ 
      error: 'Name missing' 
    })
  }

  if (!body.number) {
    return response.status(400).json({ 
      error: 'Number missing' 
    })
  }  

  Person.find({}).then(persons => {
    const nameList = persons.map(n => n.name)

    if (nameList.includes(body.name)) {
      return response.status(400).json({
        error: 'Name must be unique'
      })
    } else {
      const person = new Person({
        name: body.name,
        number: body.number,
      })
      person.save().then(savedPerson => {
        console.log(`Added ${savedPerson.name} number ${savedPerson.number} to phonebook!`)
        response.json(savedPerson)
      })      
    }
  })
  // persons = persons.concat(person)
})

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})