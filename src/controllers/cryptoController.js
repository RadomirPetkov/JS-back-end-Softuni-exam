const cryptoController = require(`express`).Router()
const { createCrypto, getAll, getOneById, getOneDetailed, findOneByIdAndUpdate } = require(`../services/cryptoService`)


cryptoController.get(`/`, async (req, res) => {
    const crypto = await getAll().lean()
    res.render(`crypto/catalog`, { crypto })
})

cryptoController.get(`/create`, (req, res) => {
    res.render(`crypto/create`)
})

cryptoController.post(`/create`, async (req, res) => {
    try {
        const cryptoData = req.body
        cryptoData.owner = req.user._id
        await createCrypto(cryptoData)
        res.redirect(`/crypto`)
    } catch (error) {
        res.render(`crypto/create`, { error })
    }
})


module.exports = cryptoController

