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

cryptoController.get(`/details/:cryptoId`, async (req, res) => {
    const cryptoId = req.params.cryptoId
    const currentCrypto = await getOneDetailed(cryptoId, "boughtBy").lean()
    const currentCryptoUnleaned = await getOneById(cryptoId)
    const ownerId = currentCrypto.owner
    const currentUser = req.user?._id
    const isOwner = ownerId == currentUser

    const isBoughtByUser = currentCryptoUnleaned.boughtBy.includes(currentUser)
    // const tenants = currentHouse.rentedAHome.map(x=> x.name).join(`, `)

    res.render(`crypto/details`, { ...currentCrypto, isOwner })
})

cryptoController.get(`/edit/:cryptoId`, async (req, res) => {
    const cryptoId = req.params.cryptoId
    const currentCrypto = await getOneById(cryptoId).lean()
    currentCrypto[`${currentCrypto.paymentMethod}`] = true
    res.render(`crypto/edit`, currentCrypto)
})

cryptoController.post(`/edit/:cryptoId`, async (req, res) => {
    const updatedCryptoData = req.body
    const currentCryptoId = req.params.cryptoId

    try {
        await findOneByIdAndUpdate(currentCryptoId, updatedCryptoData)
        res.redirect(`/crypto/details/${currentCryptoId}`)
    } catch (error) {
        res.render(`crypto/edit`, { error })
    }
})


module.exports = cryptoController

