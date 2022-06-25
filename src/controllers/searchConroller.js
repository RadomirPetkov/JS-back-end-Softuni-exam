const { getAll, searchCryptoByNameAndPayment } = require(`../services/cryptoService`)

const searchController = require(`express`).Router()


searchController.get(`/`, async (req, res) => {

    const cryptoes = await getAll().lean()
    const matches = cryptoes.length > 0

    res.render("home/search", { cryptoes, matches })
})

searchController.post(`/`, async (req, res) => {
    const { searchedCoin, payment } = req.body
    const foundCoins = await searchCryptoByNameAndPayment(searchedCoin, payment)
    const matches = foundCoins.length > 0

    res.render("home/search", { foundCoins, matches })

})
module.exports = searchController

