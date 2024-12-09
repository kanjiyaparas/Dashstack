const { httpErrors, httpSuccess } = require('../constents')
const unitModel = require('../Unit/UnitModel')
const wingModel = require('../Wing/WingModel')
const societyModel = require('./SocietyModel')

class SocietyController {
  async createSociety(req, res) {
    try {
      const { societyName, societyAddress, country, state, city, zipCode, societyType, wingCount } = req.body
      if (!societyName || !societyAddress || !country || !state || !city || !zipCode || !societyType || !wingCount) throw httpErrors[400]
      const result = await societyModel.model.create({ ...req.body })
      if (!result) throw httpErrors[500]
      for (let i = 0; i < wingCount; i++) {
        let letter = String.fromCharCode(65 + i);
        await wingModel.model.create({ wingName: letter, societyId: result._id })
      }
      return res.status(200).send({ message: httpSuccess, data: result })
    } catch (error) {
      console.log(error)
      throw httpErrors[500]
    }
  }

  async listSociety(req, res) {
    try {
      const result = await societyModel.model.find()
      if (!result) throw httpErrors[400]
      return res.status(200).send({ message: httpSuccess, data: result })
    } catch (error) {
      console.log(error)
      throw httpErrors[500]
    }
  }

  async getSocietyById(req, res) {
    try {
      const { id } = req.params
      const result = await societyModel.model.findOne({ _id: id })
      if (!result) throw httpErrors[400]
      return res.status(200).send({ message: httpSuccess, data: result })
    } catch (error) {
      console.log(error)
      throw httpErrors[500]
    }
  }

  async deleteSocietyById(req, res) {
    try {
      const { id } = req.params
      const society = await societyModel.model.findById(id);
      if (!society) {
        return res.status(404).send({ message: "Society not found" });
      }
      await wingModel.model.deleteMany({ societyId: id });
      await unitModel.model.deleteMany({ societyId: id });
      await societyModel.model.findByIdAndDelete(id);
      return res.status(200).send({ message: httpSuccess })
    } catch (error) {
      console.log(error)
      throw httpErrors[500]
    }
  }
}

const societyController = new SocietyController()
module.exports = societyController