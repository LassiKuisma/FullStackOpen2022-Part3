const express = require('express')
const app = express()

app.use(express.json())

const persons = [
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

    response.json(persons)
})

// info page
app.get('/info', (request, response) => {
    console.log("Info page");

    const now = new Date()
    console.log('Now is:', now.toUTCString());

    const amount = persons.length
    const dateStr = now.toUTCString()
    response.send(
        `<p>Phonebook has info of ${amount} people</p>
    <p>${dateStr}</p>`
    )
})

const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})
