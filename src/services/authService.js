const User = require(`../models/User`)
const bcrypt = require(`bcrypt`)
const jwt = require(`jwt-promisify`)

const {jwtPrivateKey} = require(`../config/commonConst`)
const saltRounds = 10

exports.register = async (username, password, adress) => {
    try {
        const hasedPassword = await bcrypt.hash(password, saltRounds)
        const user = await User.create({ username, password: hasedPassword, adress })
        return user
    } catch (error) {
        throw error
    }
}

exports.login = async (username, password) =>{
    const user = await User.findOne({username}).lean()
    if (!user) {
        throw (`Invalid user`)

    }
    const isAuth = await bcrypt.compare(password, user.password)
    if(isAuth){
        const token = jwt.sign(user, jwtPrivateKey)
        return token
    } else {
        throw (`Your password doesn't match`)
    }

}