const securityProtocolModel = require('./SecurityProtocolModel.js')
const { httpErrors, httpSuccess } = require("../constents")

class SecurityProtocolController {
  async createProtocols(req, res) {
    try {

      const { societyId, title, discription, date, time } = req.body
      if (!societyId || !title || !discription || !date || !time) throw httpErrors[400]

      const result = await securityProtocolModel.model.create({ ...req.body })
      if (!result) throw httpErrors[400]
      return res.status(200).send({ message: httpSuccess, data: result })
    } catch (error) {
      console.log(error);
      throw httpErrors[500]
    }
  }

  async getSecurityProtocols(req, res) {
    try {
      const { societyId } = req.params
      const result = await securityProtocolModel.model.find({ societyId: societyId })
      if (!result) throw httpErrors[400]

      return res.status(200).send({ message: httpSuccess, data: result })
    } catch (error) {
      console.log(error);
      throw httpErrors[500]
    }
  }

  async deleteProtocols(req, res) {
    try {
      const { id } = req.params

      const result = await securityProtocolModel.model.deleteOne({ _id: id })

      if (!result || !result.deletedCount <= 0) throw httpErrors[400]
      return res.status(200).send({ message: httpSuccess })
    } catch (error) {
      console.log(error);
      throw httpErrors[500]
    }
  }

  async updateSecurityProtocol(req, res) {
    try {
      const { id } = req.params
      if (!id) throw httpErrors[400]
      const result = await securityProtocolModel.model.updateOne({ _id: id }, { ...req.body })
      if (!result && result.updatedCount < 0) throw httpErrors[400]
      return res.status(200).send({ message: httpSuccess })
    } catch (error) {
      console.log(error)
      throw httpErrors[500]
    }
  }
}

const securityProtocolController = new SecurityProtocolController()

module.exports = securityProtocolController