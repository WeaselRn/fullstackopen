const express = require('express')
const cors = require('cors')

const app = express()

app.use(cors())
app.use(express.json())

let persons = [
    {
        id: "1",
        name: "Arto Hellas",
        number: "040-123456"
    },
    {
        id: "2",
        name: "Ada Lovelace",
        number: "39-44-5323523"
    },
    {
        id: "3",
        name: "Dan Abramov",
        number: "12-43-234345"
    },
    {
        id: "4",
        name: "Mary Poppendieck",
        number: "39-23-6423122"
    }
]

/* 3.1 GET all persons */
app.get('/api/persons', (request, response) => {
    response.json(persons)
})

/* 3.2 info page */
app.get('/info', (request, response) => {
    const total = persons.length
    const time = new Date()

    response.send(`
    <p>Phonebook has info for ${total} people</p>
    <p>${time}</p>
  `)
})

/* 3.3 get single person */
app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id
    const person = persons.find(p => p.id === id)

    if (person) {
        response.json(person)
    } else {
        response.status(404).end()
    }
})

/* 3.4 delete person */
app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id
    persons = persons.filter(p => p.id !== id)

    response.status(204).end()
})

/* helper function for id generation */
const generateId = () => {
    return Math.floor(Math.random() * 1000000).toString()
}

/* 3.5 & 3.6 add new person */
app.post('/api/persons', (request, response) => {

    const body = request.body

    if (!body.name || !body.number) {
        return response.status(400).json({
            error: 'name or number missing'
        })
    }

    const nameExists = persons.some(
        person => person.name === body.name
    )

    if (nameExists) {
        return response.status(400).json({
            error: 'name must be unique'
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
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})