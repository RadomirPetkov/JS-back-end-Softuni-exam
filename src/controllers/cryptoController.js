const cryptoController = require(`express`).Router()
const { createCrypto, getAll, getOneById, getOneDetailed, findOneByIdAndUpdate, deleteOne, buy } = require(`../services/cryptoService`)
const { isUser, isOwner, isUserButNotOwner } = require(`../middlewares/authMiddleware`)


cryptoController.get(`/`, async (req, res) => {
    try {
        const crypto = await getAll().lean()
        res.render(`crypto/catalog`, { crypto })
    } catch (error) {
        console.log(error);
    }

})

cryptoController.get(`/create`, isUser, (req, res) => {
    res.render(`crypto/create`)
})

cryptoController.post(`/create`, isUser, async (req, res) => {
    try {
        const cryptoData = req.body

        if (cryptoData.price > 0) {
            cryptoData.owner = req.user._id
            await createCrypto(cryptoData)
            res.redirect(`/crypto`)
        } else {
            res.render(`crypto/create`, {error: "Price must be higher than 0"})
        }
    } catch (error) {
        res.render(`crypto/create`, { error })
    }
})

cryptoController.get(`/details/:cryptoId`, async (req, res) => {
    try {
        const cryptoId = req.params.cryptoId
        const currentCrypto = await getOneDetailed(cryptoId, "boughtBy").lean()
        const currentCryptoUnleaned = await getOneById(cryptoId)
        const ownerId = currentCrypto.owner
        const currentUser = req.user?._id
        const isOwner = ownerId == currentUser

        const isBoughtByUser = currentCryptoUnleaned.boughtBy.includes(currentUser)

        res.render(`crypto/details`, { ...currentCrypto, isOwner, isBoughtByUser })
    } catch (error) {
        res.render(`404`)

    }

})

cryptoController.get(`/edit/:cryptoId`, isUser, isOwner, async (req, res) => {
    try {
        const cryptoId = req.params.cryptoId
        const currentCrypto = await getOneById(cryptoId).lean()
        currentCrypto[`${currentCrypto.paymentMethod}`] = true
        res.render(`crypto/edit`, currentCrypto)
    } catch (error) {
        res.render(`404`)
    }

})

cryptoController.post(`/edit/:cryptoId`, isUser, isOwner, async (req, res) => {
    const updatedCryptoData = req.body
    const currentCryptoId = req.params.cryptoId

    try {
        await findOneByIdAndUpdate(currentCryptoId, updatedCryptoData)
        res.redirect(`/crypto/details/${currentCryptoId}`)
    } catch (error) {
        res.render(`crypto/edit`, { error })
    }
})

cryptoController.get(`/delete/:cryptoId`, isUser, isOwner, async (req, res) => {
    const cryptoId = req.params.cryptoId
    try {
        await deleteOne(cryptoId)
        res.redirect(`/crypto`)

    } catch (error) {
        res.render(`404`, { error })
    }

})

cryptoController.get(`/buy/:cryptoId`, isUser, isUserButNotOwner, async (req, res) => {
    const cryptoId = req.params.cryptoId
    const currentUserId = req.user._id
    try {
        await buy(cryptoId, currentUserId)
        res.redirect(`/crypto/details/${cryptoId}`)
    } catch (error) {
        res.render(`404`)
    }

})



module.exports = cryptoController

