const { httpErrors, httpSuccess } = require("../constents")
const expanseNoteModel = require("./ExpanseNoteModel")

class EpxanseNoteController {
  async createNote(req, res) {
    try {
      const { societyId, title, description, date } = req.body
      if (!societyId || !title || !description || !date) throw httpErrors[400]
      const result = await expanseNoteModel.model.create({ ...req.body })
      if (!result) throw httpErrors[500]
      return res.status(200).send({ message: httpSuccess })
    } catch (error) {
      console.log(error)
      throw httpErrors[500]
    }
  }

  async listNote(req, res) {
    try {
      const { societyId } = req.params
      if (!societyId) throw httpErrors[400]
      const result = await expanseNoteModel.model.find({ societyId: societyId })
      if (!result) throw httpErrors[500]
      return res.status(200).send({ message: httpSuccess, data: result })
    } catch (error) {
      console.log(error);
      throw httpErrors[500]
    }
  }

  async listById(req, res) {
    try {
      const { id } = req.params
      if (!id) throw httpErrors[400]
      const result = await expanseNoteModel.model.findOne({ _id: id })
      if (!result) throw httpErrors[500]
      return res.status(200).send({ message: httpSuccess, data: result })
    } catch (error) {
      console.log(error)
      throw httpErrors[500]
    }
  }

  async updateNote(req, res) {
    try {
      const { id } = req.params
      if (!id) throw httpErrors[400]
      const result = await expanseNoteModel.model.updateOne({ _id: id }, { ...req.body })
      if (!result && result.updatedCount < 0) throw httpErrors[500]
      return res.status(200).send({ message: httpSuccess })
    } catch (error) {
      console.log(error);
      throw httpErrors[500]
    }
  }

  async deleteNote(req, res) {
    try {
      const { id } = req.params
      if (!id) throw httpErrors[400]
      const result = await expanseNoteModel.model.deleteOne({ _id: id })
      if (!result && result.deletedCount < 0) throw httpErrors[500]
      return res.status(200).send({ message: httpSuccess })
    } catch (error) {
      console.log(error)
      throw httpErrors[500]
    }
  }

}

const expanseNoteController = new EpxanseNoteController()
module.exports = expanseNoteController