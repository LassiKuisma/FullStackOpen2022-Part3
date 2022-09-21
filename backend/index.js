require('dotenv').config()
const express = require('express')
const app = express()
const Contact = require('./models/contact')

app.use(express.static('build'))

const morgan = require('morgan')

const cors = require('cors')
app.use(cors())

morgan.token('contact-data', request => {
    if (request.method !== 'POST') {
        return ''
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
app.get('/api/persons/:id', (request, response, next) => {
    Contact.findById(request.params.id)
        .then(contact => {
            if (contact) {
                response.json(contact)
            } else {
                response.status(404).end()
            }
        })
        .catch(error => next(error))
})

// delete
app.delete('/api/persons/:id', (request, response, next) => {
    Contact.findByIdAndDelete(request.params.id)
        .then(_deleteResponse => {
            response.status(204).end()
        })
        .catch(error => next(error))
})

// create new
app.post('/api/persons', (request, response, next) => {
    const body = request.body

    const contact = new Contact({
        name: body.name,
        number: body.number
    })

    contact.save()
        .then(saved => {
            response.json(saved)
        })
        .catch(error => next(error))
})

// update existing
app.put('/api/persons/:id', (request, response, next) => {
    const { name, number } = request.body

    Contact.findByIdAndUpdate(
        request.params.id,
        { name, number },
        { new: true, runValidators: true, context: 'query' })
        .then(updated => {
            response.json(updated)
        })
        .catch(error => next(error))
})

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
    console.error(error.message)

    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' })
    } else if (error.name === 'ValidationError') {
        return response.status(400).json({ error: error.message })
    }

    next(error)
}

app.use(errorHandler)


const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
