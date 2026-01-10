const mongoose = require('mongoose')

mongoose.set("strictQuery", false)

const url = process.env.MONGO_URI

mongoose.connect(url, {family: 4})
    .then((result) => {
        console.log("connected to mongo database successfully");
    })
    .catch((err) => {
        console.log(`couldn't connect to the mongo database: ${err.message}`);
    })

const personSchema = new mongoose.Schema({
    name: {
        type: String,
        minLength: 3,
        required: true
    },
    number: {
        type: String,
        minLength: 8,
        validate: {
            validator: function(num) {
                // return num.length >= 8 && /^\d{2,3}-\d+$/.test(num)
                return /^\d{2,3}-\d+$/.test(num)
            },
            message: (props) => `${props.value} is not a valid phone number!`
        },
        required: true
    }
})

personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

const Person = mongoose.model('Person', personSchema)

module.exports = Person