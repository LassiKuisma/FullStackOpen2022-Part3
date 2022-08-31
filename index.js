const express = require('express')
const app = express()

const morgan = require('morgan')

morgan.token('contact-data', request => {
    if (request.method !== "POST") {
        return ""
    }

    return JSON.stringify(request.body)
})

app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :contact-data'))

let contacts = [
    {
        "name": "Arto Hellas",
        "number": "040-123456",
        "id": 1
    },
    {
        "name": "Ada Lovelace",
        "number": "39-44-5323523",
        "id": 2
    },
    {
        "name": "Dan Abramov",
        "number": "12-43-234345",
        "id": 3
    },
    {
        "name": "Mary Poppendieck",
        "number": "39-23-6423122",
        "id": 4
    }
]

// main page
app.get('/', (request, response) => {
    response.send('<h1>Hello!</h1>')
})

// all contacts
app.get('/api/persons', (request, response) => {
    response.json(contacts)
})

// info page
app.get('/info', (request, response) => {
    const amount = contacts.length
    const now = new Date()
    const dateStr = now.toUTCString()
    response.send(
        `<p>Phonebook has info of ${amount} people</p>
    <p>${dateStr}</p>`
    )
})

// get individual info
app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)

    const contact = contacts.find(contact => contact.id === id)
    if (contact) {
        response.json(contact)
    } else {
        response.status(404).end()
    }
})

// delete
app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    contacts = contacts.filter(contact => contact.id !== id)

    response.status(204).end()
})

const generateId = () => {
    const maxId = 100000;
    return Math.floor(Math.random() * maxId);
}

// create new
app.post('/api/persons', (request, response) => {
    const body = request.body
    const id = generateId()

    if (!body.name) {

        return response.status(400).json({
            error: 'name missing'
        })
    }

    if (!body.number) {

        return response.status(400).json({
            error: 'number missing'
        })
    }


    const existingContact = contacts.find(contact => contact.name === body.name)
    if (existingContact) {
        return response.status(400).json({
            error: 'name must be unique'
        })
    }

    const contact = {
        name: body.name,
        number: body.number,
        id: id
    }

    contacts = contacts.concat(contact)

    response.json(contact)
})

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)


const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})
