const { httpErrors, httpSuccess } = require("../constents")
const announcementModel = require("./AnnouncementModel")

class AnnouncementController {
  async createAnnouncement(req, res) {
    try {
      const { societyId, announcementTitle, announcementDescription, announcementDate, announcementTime } = req.body
      if (!societyId || !announcementTitle || !announcementDescription || !announcementDate || !announcementTime) throw httpErrors[400]
      const result = await announcementModel.model.create({ ...req.body })
      if (!result) throw httpErrors[500]
      return res.status(200).send({ message: httpSuccess })
    } catch (error) {
      console.log(error)
      throw httpErrors[500]
    }
  }

  async listAnnouncement(req, res) {
    try {
      const { societyId } = req.params
      if (!societyId) throw httpErrors[400]
      const result = await announcementModel.model.find({ societyId: societyId })
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
      const result = await announcementModel.model.findOne({ _id: id })
      if (!result) throw httpErrors[500]
      return res.status(200).send({ message: httpSuccess, data: result })
    } catch (error) {
      console.log(error)
      throw httpErrors[500]
    }
  }

  async updateAnnouncement(req, res) {
    try {
      const { id } = req.params
      if (!id) throw httpErrors[400]
      const result = await announcementModel.model.updateOne({ _id: id }, { ...req.body })
      if (!result && result.updatedCount < 0) throw httpErrors[500]
      return res.status(200).send({ message: httpSuccess })
    } catch (error) {
      console.log(error);
      throw httpErrors[500]
    }
  }

  async deleteAnnouncement(req, res) {
    try {
      const { id } = req.params
      if (!id) throw httpErrors[400]
      const result = await announcementModel.model.deleteOne({ _id: id })
      if (!result && result.deletedCount < 0) throw httpErrors[500]
      return res.status(200).send({ message: httpSuccess })
    } catch (error) {
      console.log(error)
      throw httpErrors[500]
    }
  }
}
const announcementController = new AnnouncementController()
module.exports = announcementController