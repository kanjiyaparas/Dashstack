const { httpErrors, httpSuccess } = require('../constents')
const userModel = require('../Users/UserModel')
const societyHandlerModel = require('./SocietyHandlerModel')
const bcrypt = require("bcrypt")


class SocietyHandlerController {

  async createChairman(req, res) {
    try {
      const { firstName, lastName, email, phoneNumber, password, confirmPassword, selectSociety } = req.body
      if (!firstName || !lastName || !email || !phoneNumber || !password || !confirmPassword || !selectSociety) throw httpErrors[400]
      const encryptedPass = bcrypt.hashSync(password, 5)
      if (!encryptedPass) throw httpErrors[500]
      const userName = `${firstName} ${lastName}`
      const user = await userModel.model.create({ fullName: userName, email, phoneNumber, password: encryptedPass, role: "Chairman" })
      if (!user) throw httpErrors[500]
      delete req.body.password
      delete req.body.confirmPassword
      const data = {
        selectSociety,
        userId: user._id
      }
      const result = await societyHandlerModel.model.create({ ...data })
      if (!result) throw httpErrors[500]
      return res.status(200).send({ message: httpSuccess, data: result })
    } catch (error) {
      console.log(error)
      throw httpErrors[500]
    }
  }


}

const societyHandlerController = new SocietyHandlerController()
module.exports = societyHandlerController