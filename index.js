const express = require(`express`)
const cookieParser = require(`cookie-parser`)
const router = require(`./router`)
const app = express()
const { initializeDatabase } = require(`./src/config/database`)
const port = 3000
require(`./src/config/express-handlebars`)(app)
const {auth} = require(`./src/middlewares/authMiddleware`)


app.use("/", express.static("static"))
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(auth)
app.use(router)

initializeDatabase()
    .then(
        app.listen(port, () => console.log(`App is listening on port ${port}`)))