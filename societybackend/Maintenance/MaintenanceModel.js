const { default: mongoose } = require("mongoose");

class MaintenanceModel {
  constructor() {
    this.schema = new mongoose.Schema({
      societyId: { type: mongoose.Types.ObjectId, required: true, ref: "tbl_Securities" },
      maintenanceAmount: { type: Number, required: true },
      penaltyAmount: { type: Number, required: true, default: 0 },
      dueDate: { type: Date, default: Date.now },
      dueDays: { type: Number, required: true }
    }, {
      timestamps: true
    })

    // Middleware to delete related entries in tbl_eventdetails
    this.schema.pre("remove", async function (next) {
      const maintenanceId = this._id; // Access the event ID being removed
      await mongoose.model("tbl_maintenanceDetails").deleteMany({ maintenanceId });
      next();
    });

    this.model = mongoose.model("tbl_maintenances", this.schema)
  }
}

const maintenanceModel = new MaintenanceModel()

module.exports = maintenanceModel