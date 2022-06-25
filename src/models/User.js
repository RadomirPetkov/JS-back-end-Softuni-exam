const mongoose = require(`mongoose`)

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Username is required'],
        minLength: 5
    },
    email: {
        type: String,
        required: true,
        minLength: 10
    },
    password: {
        type: String,
        required: true,
        minLength:4
    }
    
})

const User = mongoose.model(`User`, userSchema)

module.exports = User