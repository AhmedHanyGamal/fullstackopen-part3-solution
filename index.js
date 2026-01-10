require("dotenv").config()
const express = require("express")
const morgan = require("morgan")
const Person = require("./models/person")

const app = express()

morgan.token("post-data", (request) => JSON.stringify(request.body))

app.use(express.static('dist'))
app.use(express.json())
app.use(morgan(":method :url :status :res[content-length] - :response-time ms - :post-data"))


app.get('/api/persons', (request, response, next) => {
    Person.find({})
    .then(people => {
        response.json(people)
    })
    .catch((error) => next(error))
})

app.get('/api/persons/:id', (request, response, next) => {
    const id = request.params.id

    Person.findById(id)
    .then((person) => {
        if(!person) {
            return response.status(404).end()
        }

        return response.json(person)
    })
    .catch((error) => next(error))
})

app.get('/info', (request, response, next) => {
    Person.countDocuments()
    .then((docCount) => {
        const currentTime = new Date()
        return response.send(`<p>Phonebook has info for ${docCount} people</p><p>${currentTime}</p>`)
    })
    .catch((error) => next(error))
})

app.post('/api/persons', (request, response, next) => {
    const {name, number} = request.body
    
    if (!name || !number) {
        return response.status(400).json({
            error: 'request requires both {name} and {number} properties'
        })
    }

    const newPerson = new Person({name, number})
    newPerson.save()
    .then((result) => {
        response.status(201).json(result)
    })
    .catch((error) => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
    const id = request.params.id

    Person.findByIdAndDelete(id)
    .then((result) => {
        response.status(204).end()
    })
    .catch((error) => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
    const id = request.params.id

    const {name, number} = request.body

    if(!name || !number) {
        return response.status(400).json({
            error: "both {name} and {number} must exist in the request body"
        })
    }

    Person.findById(id)
    .then((person) => {
        if (!person) {
            return response.status(404).json({
                error: "person doesn't exist"
            })
        }

        person.name = name
        person.number = number

        return person.save()
        .then((result) => {
            response.json(result)
        })
        .catch((error) => next(error))
    })
    .catch((error) => next(error))
})


const errorHandler = (error, request, response, next) => {
    console.error(error.message);

    if(error.name === "CastError") {
        return response.status(400).json({
            error: "malformatted id"
        })
    }
    else if(error.name === "ValidationError") {
        return response.status(400).json({
            error: error.message
        })
    }

    next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`listening on port ${PORT}`);
})