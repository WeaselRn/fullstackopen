require('dotenv').config()

const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const mongoose = require('mongoose')

const Person = require('./models/person')
const errorHandler = require('./middleware/errorHandler')

const app = express()

app.use(cors())
app.use(express.json())

/* Morgan logging */
morgan.token('body', req => JSON.stringify(req.body))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

/* MongoDB connection */
mongoose.set('strictQuery', false)

mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log('connected to MongoDB')
    })
    .catch(error => {
        console.log('error connecting to MongoDB:', error.message)
    })

/* GET all persons */
app.get('/api/persons', (request, response) => {
    Person.find({}).then(persons => {
        response.json(persons)
    })
})

/* GET single person */
app.get('/api/persons/:id', (request, response, next) => {
    Person.findById(request.params.id)
        .then(person => {
            if (person) {
                response.json(person)
            } else {
                response.status(404).end()
            }
        })
        .catch(error => next(error))
})

/* INFO route */
app.get('/info', (request, response) => {
    Person.countDocuments({})
        .then(count => {
            const time = new Date()
            response.send(`
        <p>Phonebook has info for ${count} people</p>
        <p>${time}</p>
      `)
        })
})

/* ADD person */
app.post('/api/persons', (request, response, next) => {

    const body = request.body

    const person = new Person({
        name: body.name,
        number: body.number
    })

    person.save()
        .then(savedPerson => {
            response.json(savedPerson)
        })
        .catch(error => next(error))
})

/* DELETE person (3.15) */
app.delete('/api/persons/:id', (request, response, next) => {

    Person.findByIdAndDelete(request.params.id)
        .then(() => {
            response.status(204).end()
        })
        .catch(error => next(error))
})

/* UPDATE number (3.17) */
app.put('/api/persons/:id', (request, response, next) => {

    const { name, number } = request.body

    const person = {
        name,
        number
    }

    Person.findByIdAndUpdate(
        request.params.id,
        person,
        { new: true, runValidators: true, context: 'query' }
    )
        .then(updatedPerson => {
            response.json(updatedPerson)
        })
        .catch(error => next(error))
})

/* Unknown endpoint */
app.use((request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
})

/* Error handler middleware (3.16) */
app.use(errorHandler)

const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})