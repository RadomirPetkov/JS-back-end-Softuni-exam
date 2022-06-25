const mongoose = require(`mongoose`)

const cryptoSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minLength:2
    },
    image: {
        type: String,
        required: true,
        validate: {
            validator: /^https?:\/\//g,
            message: "Image URLshould be a link"
        }
    },
    price: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true,
        minLength: 10
    },
    paymentMethod: {
        type: String,
        enum: ["crypto-wallet", "credit-card", "debit-card", "paypal"],
        required: true,
    }, 
    boughtBy: [{
        type: mongoose.Types.ObjectId,
        ref: "User"
    }],
    owner: [{
        type: mongoose.Types.ObjectId,
        ref: "User"
    }]
})

const Crypto = mongoose.model(`Crypto`, cryptoSchema)

module.exports = Crypto