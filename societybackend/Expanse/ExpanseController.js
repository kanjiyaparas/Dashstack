const { httpErrors, httpSuccess } = require("../constents");
const expanseModel = require("./ExpanseModel");

class ExpanseController {
  async createExpanses(req, res) {
    try {
      const { societyId, title, amount, date, discription } = req.body
      const file = req.file
      if (!societyId || !title || !amount || !date || !discription || !file) throw httpErrors[400]
      const result = await expanseModel.model.create({ ...req.body, billDocument: file.path })
      if (!result) throw httpErrors[500]
      return res.status(200).send({ message: httpSuccess })
    } catch (error) {
      console.log(error);
      throw httpErrors[500]
    }
  }

  async listExpanses(req, res) {
    try {
      const { societyId } = req.params
      const result = await expanseModel.model.find({ societyId: societyId })
      if (!result) throw httpErrors[500]
      return res.status(200).send({ message: httpSuccess, data: result })
    } catch (error) {
      console.log(error)
      throw httpErrors[500]
    }
  }

  async listById(req, res) {
    try {
      const { expanseId } = req.params
      if (!expanseId) throw httpErrors[400]
      const result = await expanseModel.model.findOne({ _id: expanseId })
      if (!result) throw httpErrors[500]
      return res.status(200).send({ message: httpSuccess, data: result })
    } catch (error) {
      console.log(error)
      throw httpErrors[500]
    }
  }

  async deleteExpanse(req, res) {
    try {
      const { expanseId } = req.params
      if (!expanseId) throw httpErrors[400]
      const result = await expanseModel.model.deleteOne({ _id: expanseId })
      if (!result && result.deletedCount < 0) throw httpErrors[500]
      return res.status(200).send({ message: httpSuccess, data: result })
    } catch (error) {
      console.log(error)
      throw httpErrors[500]
    }
  }

  async updateExpanse(req, res) {
    try {
      const { expanseId } = req.params
      const { societyId, title, amount, date, discription } = req.body
      const file = req.file
      if (!expanseId) throw httpErrors[400]
      if (file && file.path) req.body.billDocument = file.path
      const result = await expanseModel.model.updateOne({ _id: expanseId }, { ...req.body })
      if (!result && result.updatedCount < 0) throw httpErrors[500]
      return res.status(200).send({ message: httpSuccess, data: result })
    } catch (error) {
      console.log(error)
      throw httpErrors[500]
    }
  }
}

const expanseController = new ExpanseController()
module.exports = expanseController