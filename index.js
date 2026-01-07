const express = require("express")
const morgan = require("morgan")

const app = express()

morgan.token("post-data", (request) => JSON.stringify(request.body))

app.use(express.static('dist'))
app.use(express.json())
app.use(morgan(":method :url :status :res[content-length] - :response-time ms - :post-data"))


let persons = [
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]


app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id
    const person = persons.find((person) => person.id === id)

    if(!person) {
        return response.status(404).end()
    }

    response.json(person)
})

app.get('/info', (request, response) => {
    const personsNum = persons.length
    const currentTime = new Date()
    
    response.send(`<p>Phonebook has info for ${personsNum} people</p><p>${currentTime}</p>`)
})

app.post('/api/persons', (request, response) => {
    const {name, number} = request.body
    
    if (!name || !number) {
        return response.status(400).json({
            error: 'request requires both "name" and "number" properties'
        })
    }

    if (persons.find((person) => person.name === name)) {
        return response.status(400).json({
            error: 'name must be unique'
        })
    }
    
    const id = String(Math.floor(Math.random() * 1e9))
    const newPerson = {
        id: id,
        name: name,
        number: number
    }

    persons.push(newPerson)
    
    response.status(201).json(newPerson)
})

app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id
    persons = persons.filter(person => person.id !== id)
    response.status(204).end()
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`listening on port ${PORT}`);
})