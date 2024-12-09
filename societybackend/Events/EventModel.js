const { default: mongoose } = require("mongoose");

class EventModel {
  constructor() {
    this.schema = new mongoose.Schema({
      societyId: { type: mongoose.Types.ObjectId, required: true, ref: "tbl_societies" },
      title: { type: String, required: true },
      date: { type: Date, required: true },
      dueDate: { type: Date, required: true },
      amount: { type: Number, required: true },
      description: { type: String, required: true }
    }, {
      timestamps: true
    })

    // Middleware to delete related entries in tbl_eventdetails
    this.schema.pre("remove", async function (next) {
      const eventId = this._id; // Access the event ID being removed
      await mongoose.model("tbl_eventdetails").deleteMany({ eventId });
      next();
    });

    this.model = mongoose.model("tbl_events", this.schema)
  }
}

const eventModel = new EventModel()
module.exports = eventModel