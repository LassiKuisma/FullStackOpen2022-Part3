const mongoose = require('mongoose')

const dbUrl = (password) => {
    const dbName = 'p3phonebook'
    const url =
        `mongodb+srv://fullstack:${password}@cluster0.opqogig.mongodb.net/${dbName}?retryWrites=true&w=majority`
    return url
}

const contactModel = () => {
    const contactSchema = new mongoose.Schema({
        name: String,
        number: String,
    })

    const Contact = mongoose.model('Contact', contactSchema)
    return Contact
}

const displayInfo = (dbUrl) => {
    console.log('display contact(s):')

    mongoose.connect(dbUrl)

    const Contact = contactModel()
    Contact.find({}).then(result => {
        console.log(`Phonebook has ${result.length} contacts`)
        result.forEach(contact => {
            console.log(`${contact.name} ${contact.number}`)
        })
        mongoose.connection.close()
    })
}

const addContact = (dbUrl, name, number) => {
    console.log('adding contact...')

    mongoose.connect(dbUrl)

    const Contact = contactModel()
    const contact = new Contact({
        name: name,
        number: number
    })

    contact.save().then(_result => {
        console.log(`Added "${name}", "${number}" to phonebook`)
        mongoose.connection.close()
    })
}

// main starts here
if (process.argv.length === 3) {
    const password = process.argv[2]
    displayInfo(dbUrl(password))

} else if (process.argv.length === 5) {
    const password = process.argv[2]
    const name = process.argv[3]
    const number = process.argv[4]

    addContact(dbUrl(password), name, number)

} else {
    console.log('Give password, name and number as args to add new contact, or just password to display contacts')
    process.exit(1)
}
