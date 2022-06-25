const authController = require(`express`).Router()
const authService = require(`../services/authService`)
const { isUser, isGuest } = require(`../middlewares/authMiddleware`)


authController.get(`/register`, isGuest, (req, res) => {

    res.render("auth/register")
})

authController.post(`/register`, isGuest, async (req, res) => {
    const { username, password, repeatPassword, adress } = req.body
    if (password !== repeatPassword) {
        return res.render(`auth/register`, { error: "Password doesnt match" })
    }
    try {
        const user = await authService.register(username, password, adress)
        res.render(`home`)
    } catch (error) {
        res.render(`auth/register`, { error })
    }


})

authController.get(`/login`, isGuest, (req, res) => {

    res.render("auth/login")
})

authController.post(`/login`, isGuest, async (req, res) => {
    const { username, password } = req.body
    try {
        const user = await authService.login(username, password)
        if (user) {
            res.cookie(`session`, user)
            res.redirect(`/`)
        }
    } catch (error) {
        res.render(`auth/login`, { error })
    }

})

authController.get(`/logout`, isUser, (req, res) => {
    res.clearCookie(`session`)
    res.redirect(`/`)
})


module.exports = authController

