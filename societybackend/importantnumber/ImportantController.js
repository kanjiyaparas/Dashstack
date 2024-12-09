const importantModal = require('../importantnumber/ImportantModal')
const { httpErrors, httpSuccess } = require('../constents')


class ImportantController {
  async createWorkerNumber(req, res) {
    try {
      const { societyId, fullName, phoneNumber, work } = req.body
      if (!societyId || !fullName || !phoneNumber || !work) throw httpErrors[400]

      const result = await importantModal.model.create({ ...req.body })
      if (!result) throw httpErrors[400]
      return res.status(200).send({ message: httpSuccess, data: result })
    } catch (error) {
      console.log(error)
      throw httpErrors[500]
    }
  }

  async getWorkerDetails(req, res) {
    try {
      const { societyId } = req.params
      const result = await importantModal.model.find({ societyId: societyId })
      if (!result) throw httpErrors[400]
      return res.status(200).send({ message: httpSuccess, data: result })
    } catch (error) {
      console.log(error)
      throw httpErrors[500]
    }
  }

  async deleteWorkerDetails(req, res) {
    try {
      const { id } = req.params

      const result = await importantModal.model.deleteOne({ _id: id })

      if (!result || result.deletedCount <= 0) throw httpErrors[400]

      return res.status(200).send({ message: httpSuccess })
    } catch (error) {
      console.log(error)
      throw httpErrors[500]
    }
  }

  async updateImportantNumber(req, res) {
    try {
      const { id } = req.params
      if (!id) throw httpErrors[400]
      const result = await importantModal.model.updateOne({ _id: id }, { ...req.body })

      if (!result && result.updatedCount < 0) throw httpErrors[400]
      return res.status(200).send({ message: httpSuccess })
    } catch (error) {
      console.log(error)
      throw httpErrors[500]
    }
  }
}


const importantController = new ImportantController()

module.exports = importantController