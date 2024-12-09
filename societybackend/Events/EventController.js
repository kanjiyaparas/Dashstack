const { httpErrors, httpSuccess, key_id, key_secrate } = require("../constents")
const eventDetilsModel = require("../EventDetails/EventDetailsModel")
const memberModel = require("../Society Member/MemberModel")
const eventModel = require("./EventModel")
const Razorpay = require("razorpay");

const razorpay = new Razorpay({
  key_id: key_id, // Replace with your Razorpay Key ID
  key_secret: key_secrate, // Replace with your Razorpay Key Secret
});


class EventController {
  async createEvent(req, res) {
    try {
      const { societyId, title, date, dueDate, amount, description } = req.body
      if (!societyId || !title || !date || !dueDate || !amount || !description) throw httpErrors[400]
      const result = await eventModel.model.create({ ...req.body })
      const societyMembers = await memberModel.model.find({ societyId: societyId })
      var razorpayOrder
      await Promise.all(
        societyMembers.map(async (data) => {
          razorpayOrder = await razorpay.orders.create({
            amount: result.amount * 100, // Convert to paise
            currency: "INR",
            receipt: `receipt_${result?._id}`,
          });
          if (!razorpayOrder) {
            throw new Error("Failed to create Razorpay order");
          }
          // Create maintenance details for each member
          const eventDetails = await eventDetilsModel.model.create({
            societyId,
            eventId: result._id,
            memberId: data._id,
            amount: amount,
            paymentDate: result.dueDate,
            razorpayOrderId: razorpayOrder.id
          });
          if (!eventDetails) {
            throw new Error(`Failed to create maintenance details for member ID: ${data._id}`);
          }
        })
      );
      return res.status(200).send({
        message: httpSuccess,
        razorpayOrderId: razorpayOrder.id,
        razorpayKey: razorpay.key_id, // Send the Razorpay key to the client for initializing Razorpay checkout
        amount: razorpayOrder.amount,
      })
    } catch (error) {
      console.log(error)
      throw httpErrors[500]
    }
  }


  async listEvent(req, res) {
    try {
      const { societyId } = req.params
      let events = await eventModel.model.find({ societyId: societyId })
      if (!events) throw httpErrors[500]
      let MemberCount = await memberModel.model.find({ societyId: societyId })
      MemberCount = MemberCount?.length
      const result = events.map(event => ({
        ...event._doc,
        MemberCount
      }));
      return res.status(200).send({ message: httpSuccess, data: result })
    } catch (error) {
      console.log(error)
      throw httpErrors[500]
    }
  }

  async getevent(req, res) {
    try {
      const { societyId } = req.params
      let result = await eventModel.model.find({ societyId: societyId })
      if (!result) throw httpErrors[400]
      return res.status(200).send({ message: httpSuccess, data: result })
    } catch (error) {
      console.log(error)
      throw httpErrors[500]
    }
  }


  async getEventById(req, res) {
    try {
      const { eventId } = req.params
      const result = await eventModel.model.find({ _id: eventId })
      if (!result) throw httpErrors[500]
      return res.status(200).send({ message: httpSuccess, data: result })
    } catch (error) {
      console.log(error)
      throw httpErrors[500]
    }
  }

  async updateEvent(req, res) {
    try {
      const { eventId, societyId, title, date, dueDate, amount, description } = req.body
      if (!eventId || !societyId || !title || !date || !dueDate || !amount || !description) throw httpErrors[400]
      const result = await eventModel.model.updateOne({ _id: eventId }, { societyId: societyId, title: title, data: date, dueDate: dueDate, amount: amount, description: description })
      if (!result || result.modifiedCount <= 0) throw httpErrors[500]
      return res.status(200).send({ message: httpSuccess })
    } catch (error) {
      console.log(error)
      throw httpErrors[500]
    }
  }
  async deleteEvent(req, res) {
    try {
      const { eventId } = req.params
      const result = await eventModel.model.deleteOne({ _id: eventId })
      if (!result || result.deletedCount <= 0) throw httpErrors[500]
      return res.status(200).send({ message: httpSuccess })
    } catch (error) {
      console.log(error)
      throw httpErrors[500]
    }
  }

}

const eventController = new EventController()
module.exports = eventController