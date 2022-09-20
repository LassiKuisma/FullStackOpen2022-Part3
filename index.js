require('dotenv').config()
const express = require('express')
const app = express()
const Contact = require('./models/contact')

app.use(express.static('build'))

const morgan = require('morgan')

const cors = require('cors')
app.use(cors())

morgan.token('contact-data', request => {
    if (request.method !== "POST") {
        return ""
    }

    return JSON.stringify(request.body)
})

app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :contact-data'))


// main page
app.get('/', (request, response) => {
    response.send('<h1>Hello!</h1>')
})

// all contacts
app.get('/api/persons', (request, response) => {
    Contact.find({}).then(contacts => {
        response.json(contacts)
    })
})

// info page
app.get('/info', (request, response) => {
    Contact.find({}).then(contacts => {
        const amount = contacts.length
        const now = new Date()
        const dateStr = now.toUTCString()
        response.send(
            `<p>Phonebook has info of ${amount} people</p>
            <p>${dateStr}</p>`
        )
    })
})

// get individual info
app.get('/api/persons/:id', (request, response) => {
    Contact.findById(request.params.id)
        .then(contact => {
            if (contact) {
                response.json(contact)
            } else {
                response.status(404).end()
            }
        })
        .catch(error => {
            console.log(error);
            response.status(400).send({ error: 'malformatted id' })
        })
})

// delete
app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    //contacts = contacts.filter(contact => contact.id !== id)

    response.status(204).end()
})

// create new
app.post('/api/persons', (request, response) => {
    const body = request.body

    if (body.name === undefined) {
        return response.status(400).json({ error: 'name missing' })
    }
    if (body.number === undefined) {
        return response.status(400).json({ error: 'number missing' })
    }


    const contact = new Contact({
        name: body.name,
        number: body.number
    })

    contact.save().then(saved => {
        response.json(saved)
    })
})

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)


const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})
