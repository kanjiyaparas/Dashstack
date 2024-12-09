const { default: mongoose } = require("mongoose");

class NotificationModel {
  constructor() {
    this.schema = new mongoose.Schema({
      uniqueId: { type: mongoose.Types.ObjectId, required: true },
      title: { type: String, required: true },
      memberId: { type: mongoose.Types.ObjectId, ref: "tbl_members", required: true },
      societyId: { type: mongoose.Types.ObjectId, ref: "tbl_societies", required: true },
      Description: { type: String, required: true },
      type: { type: String, required: true, enum: ["Maintenance", "Event", "Complain", "Request"] }
    }, {
      timestamps: true
    })
    this.model = mongoose.model("tbl_notifications", this.schema)
  }
}


const notificationModel = new NotificationModel()

module.exports = notificationModel