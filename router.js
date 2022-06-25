const router = require("express").Router()
const homeController = require(`./src/controllers/homeController`)
const authController = require(`./src/controllers/authController`)
const cryptoController = require(`./src/controllers/cryptoController`)
const searchController = require("./src/controllers/searchConroller")

router.get(`/`, homeController)
router.use(`/search`, searchController)
router.use(`/auth`, authController)
router.use(`/crypto`, cryptoController)
router.get(`/404`, (req, res)=>{res.render(`404`)})



module.exports = router