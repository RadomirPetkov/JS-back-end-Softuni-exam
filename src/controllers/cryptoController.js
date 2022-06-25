const cryptoController = require(`express`).Router()
const { createCrypto, getAll, getOneById, getOneDetailed, findOneByIdAndUpdate, deleteOne, buy } = require(`../services/cryptoService`)


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
    

    res.render(`crypto/details`, { ...currentCrypto, isOwner, isBoughtByUser })
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

cryptoController.get(`/delete/:cryptoId`, async (req, res) => {
    const cryptoId = req.params.cryptoId
    try {
        await deleteOne(cryptoId)
        res.redirect(`/crypto`)

    } catch (error) {
        res.render(`404`, { error })
    }

})

cryptoController.get(`/buy/:cryptoId`, async (req, res)=>{
    const cryptoId = req.params.cryptoId
    const currentUserId = req.user._id
    try {
        await buy(cryptoId, currentUserId)
        res.redirect(`/crypto/details/${cryptoId}`)
    } catch (error) {
        console.log(error);
        
    }
    
})



module.exports = cryptoController

