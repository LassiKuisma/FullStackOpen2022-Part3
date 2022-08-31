const express = require('express')
const app = express()

app.use(express.json())

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
    console.log("Get all contacts");

    response.json(contacts)
})

// info page
app.get('/info', (request, response) => {
    console.log("Info page");

    const now = new Date()
    console.log('Now is:', now.toUTCString());

    const amount = contacts.length
    const dateStr = now.toUTCString()
    response.send(
        `<p>Phonebook has info of ${amount} people</p>
    <p>${dateStr}</p>`
    )
})

// get individual info
app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    console.log(`Getting contact with id ${id}`);

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
    console.log(`Deleting contact id=${id}`);
    contacts = contacts.filter(contact => contact.id !== id)

    response.status(204).end()
})


const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})
