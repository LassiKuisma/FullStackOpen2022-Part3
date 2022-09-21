const mongoose = require('mongoose')

const url = process.env.MONGODB_URI

console.log(`connecting to database`);

mongoose.connect(url)
    .then(result => {
        console.log('connected to mongodb');
    })
    .catch((error) => {
        console.log('Error connecting to mongodb:', error.message);
    })

const contactSchema = new mongoose.Schema({
    name: {
        type: String,
        minlength: 3,
        required: true,
    },
    number: {
        type: String,
    },
})

contactSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('Contact', contactSchema)
