const jwt = require(`jwt-promisify`)
const { jwtPrivateKey } = require(`../config/commonConst`)
const { getOneById } = require("../services/cryptoService")

exports.auth = async (req, res, next) => {

    const sessionCookie = req.cookies.session
    res.locals.isUser = false
    res.locals.isGuest = false

    if (sessionCookie) {
        const user = await jwt.verify(sessionCookie, jwtPrivateKey)

        if (user) {
            req.user = user
            res.locals.isUser = true
            res.locals.user = user

        } else {
            return res.redirect(`/404`)
        }
    } else {
        res.locals.isGuest = true
    }
    next()

}

exports.isGuest = (req, res, next) => {
    if (req.user) {
       return res.redirect(`/404`)
    }
    next()
}

exports.isUser = (req, res, next) => {
    if (req.user) {
        next()
    } else {
        return res.redirect(`/404`)
    }

}

exports.isOwner = async (req, res, next) => {

    const cryptoId = req.params.cryptoId
    const currentCrypto = await getOneById(cryptoId).lean()
    const ownerId = currentCrypto.owner
    const currentUser = req.user?._id
    const isOwner = ownerId == currentUser

    if (isOwner) {
        next()
    } else {
        return res.redirect(`/404`)
    }

}

exports.isUserButNotOwner = async (req, res, next) => {

    const cryptoId = req.params.cryptoId
    const currentCrypto = await getOneById(cryptoId).lean()
    const ownerId = currentCrypto.owner
    const currentUser = req.user?._id
    const isOwner = ownerId == currentUser

    if (!isOwner) {
        next()
    } else {
        return res.redirect(`/404`)
    }

}