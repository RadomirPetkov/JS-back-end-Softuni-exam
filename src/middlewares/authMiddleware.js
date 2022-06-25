const jwt = require(`jwt-promisify`)
const { jwtPrivateKey } = require(`../config/commonConst`)

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
        res.redirect(`/404`)
    }
    next()
}

exports.isUser = (req, res, next) => {
    if (req.user) {
        next()
    } else {
        res.redirect(`/404`)
    }

}