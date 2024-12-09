const { httpErrors } = require("../constents")
const notificationModel = require("./NotificationModel")

class NotificationController {
  async listNotify(req, res) {
    try {
      const { societyId } = req.params
      const result = await notificationModel.model.find({ societyId: societyId }).populate({ path: 'memberId', populate: ([{ path: "userId" }, { path: "unit" }, { path: "wing" }]) })
      if (!result) throw httpErrors[500]
      return res.status(200).send({ message: httpErrors[200], data: result })
    } catch (error) {
      console.log(error)
    }
  }

  async deleteNotification(req, res) {
    try {
      const { id } = req.params
      const result = await notificationModel.model.deleteOne({ _id: id })
      if (!result || result.deletedCount <= 0) throw httpErrors[500]
      return res.status(200).send({ message: httpErrors[200] })
    } catch (error) {
      console.log(error);
    }
  }
}

const notificationController = new NotificationController

module.exports = notificationController