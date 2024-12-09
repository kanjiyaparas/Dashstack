const { httpErrors, httpSuccess } = require("../constents")
const wingModel = require("./WingModel")

class WingController {
  async createWing(req, res) {
    try {
      const { wingName, societyId } = req.body
      if (!wingName || !societyId) throw httpErrors[400]
      const result = await wingModel.model.create({ ...req.body })
      if (!result) throw httpErrors[500]
      return res.status(200).send({ message: httpSuccess, data: result })
    } catch (error) {
      console.log(error)
      throw httpErrors[500]
    }
  }

  async listWing(req, res) {
    try {
      const { societyId } = req.params
      const result = await wingModel.model.find({ societyId: societyId })
      if (!result) throw httpErrors[400]
      return res.status(200).send({ message: httpSuccess, data: result })
    } catch (error) {
      console.log(error)
      throw httpErrors[500]
    }
  }

  async getWingById(req, res) {
    try {
      const { id } = req.params
      const result = await wingModel.model.findOne({ _id: id })
      if (!result) throw httpErrors[400]
      return res.status(200).send({ message: httpSuccess, data: result })
    } catch (error) {
      console.log(error)
      throw httpErrors[500]
    }
  }

  async deleteWingById(req, res) {
    try {
      const { id } = req.params
      const result = await wingModel.model.deleteOne({ _id: id })
      if (!result || result.deletedCount <= 0) throw httpErrors[400]
      return res.status(200).send({ message: httpSuccess })
    } catch (error) {
      console.log(error)
      throw httpErrors[500]
    }
  }
}

const wingController = new WingController()
module.exports = wingController