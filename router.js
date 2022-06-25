const router = require("express").Router()
const homeController = require(`./src/controllers/homeController`)
const authController = require(`./src/controllers/authController`)

router.get(`/`, homeController)
router.use(`/auth`, authController)
router.get(`/404`, (req, res)=>{res.render(`404`)})



module.exports = router