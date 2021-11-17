const { request } = require('express')
const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')


app.use(cors())
app.use(express.static('build'))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :data'))

app.use(express.json())

morgan.token('data', (request,response) => {
  return JSON.stringify(request.body)
})

const requestLogger = (request, response, next) => {
  console.log('Method:', request.method)
  console.log('Path:', request.path)
  console.log('Body:', request.body)
  console.log('---')
  next()
}

app.use(requestLogger)


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
  response.send('<h1>Hello World!</h1>')
})

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const person = persons.find(person => person.id === id)


  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }
})

const generateId = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min


app.post('/api/persons', (request, response) => {

  const body = request.body

  if (!body.name || !body.number) {
    return response.status(400).json({
      error: 'some information is missing'
    })
  }

  const existedName = persons.filter(person => person.name === body.name)

  if (existedName.length > 0) {
    return response.status(400).json({
      error: `The name ${body.name} already exists in the phonebook`
    })
  }

   
  

 

  const person = {
    name: body.name,
    number: body.number,
    id: generateId(1, 1000)
  }

  persons = persons.concat(person)
  
  response.json(person)
})

app.get('/api/persons', (request, response) => {
  response.json(persons)
})

app.get('/info', (request, response) => {
  const quantity = persons.length
  response.send(`Phonebook has info for ${quantity} people`
    + `<p> ${new Date()} </p>`
  )
})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter(person => person.id !== id)

  response.status(204).end()
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({error: 'unknown endpoint'})
}

app.use(unknownEndpoint)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})