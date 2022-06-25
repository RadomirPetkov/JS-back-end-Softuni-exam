const cryptoController = require(`express`).Router()
const { createHouse, getAll, getOneById, getOneDetailed, findOneByIdAndUpdate} = require(`../services/cryptoService`)


cryptoController.get(`/`, async (req, res) => {
    const crypto = await getAll().lean()
    res.render(`crypto/catalog`, { crypto })
})


module.exports = cryptoController

