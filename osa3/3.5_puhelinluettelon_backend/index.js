const express = require('express')
const app = express()

app.use(express.json())

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

app.get('/', (request, response) => {
  response.send('<h1>Puhelinluettelo</h1>')
})

app.get('/info', (request, response) => {
  const count = persons.length
  const text = `Phonebook has info for ${count} people`
  const date = new Date().toString()
  response.send(
    `<p>${text}<br><br>${date}</p>`
  )
})


app.get('/api/persons', (request, response) => {
  response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  console.log(id)
  const person = persons.find(person => person.id === id)
  console.log(person)

  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }
})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter(person => person.id !== id)

  response.status(204).end()
})

const getRandomInt = (max) => {
  return Math.floor(Math.random() * max);
}

const generateId = () => {
  const randomId = getRandomInt(1000);
  console.log(randomId);
  const idArray = persons.map(n => n.id);
  console.log(idArray);
  
  if (idArray.includes(randomId)) {
    return generateId();
  } else {
    return randomId;
  }
}

app.post('/api/persons', (request, response) => {
  const body = request.body

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

  const person = {
    id: generateId(),
    name: body.name,
    number: body.number
  }

  persons = persons.concat(person)

  response.json(person)
})

const PORT = 3001
app.listen(PORT)
console.log(`Server running on port ${PORT}`)