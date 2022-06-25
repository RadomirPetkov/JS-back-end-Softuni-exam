const Crypto = require(`../models/Crypto`)
const mongoose = require(`mongoose`)
const User = require(`../models/User`)

exports.createCrypto = (cryptoData, owner) => Crypto.create(cryptoData)

exports.getAll = () => Crypto.find()

exports.getOneById = (cryptoId) => Crypto.findById(cryptoId)

exports.getOneDetailed = (cryptoId, model) => Crypto.findById(cryptoId).populate(model)

exports.findOneByIdAndUpdate = (cryptoId, updatedCryptoData) => Crypto.findByIdAndUpdate(cryptoId, updatedCryptoData, { runValidators: true })

exports.deleteOne = (cryptoId) => Crypto.findByIdAndDelete(cryptoId)

exports.rent = async (houseId, userId) => {
    const house = await House.findById(houseId)
    house.availablePieces -= 1
    house.rentedAHome.push(mongoose.Types.ObjectId(userId))
    house.save()
}

exports.getLastThree =async () => {
    const allHouses = await House.find().lean()
    const lastThreeHouses = allHouses.slice(-3)
    return lastThreeHouses
}