const { httpSuccess, httpErrors, key_id, key_secrate } = require("../constents");
const notificationModel = require("../Notification/NotificationModel");
const memberModel = require("../Society Member/MemberModel");
const eventDetilsModel = require("./EventDetailsModel")
const crypto = require("crypto")
const Razorpay = require("razorpay");


const paymentDate = new Date()

const razorpay = new Razorpay({
  key_id: key_id, // Replace with your Razorpay Key ID
  key_secret: key_secrate, // Replace with your Razorpay Key Secret
});


class EventDetilsController {

  async addeventmember(req, res) {
    try {
      const { societyId, eventId, memberId, amount, paymentStatus, paymentMethod, paymentDate } = req.body
      if (!societyId || !eventId || !memberId || !amount || !paymentStatus || !paymentMethod || !paymentDate) throw httpErrors[400]

      const result = await eventDetilsModel.model.create({ ...req.body })
      if (!result) throw httpErrors[400]
      return res.status(200).send({ message: httpSuccess, data: result })
    } catch (error) {
      console.log(error)
      throw httpErrors[500]
    }
  }

  async listEventDetails(req, res) {
    try {
      const { societyId } = req.params
      const result = await eventDetilsModel.model.find({ societyId: societyId })
      if (!result) throw httpErrors[500]
      return res.status(200).send({ message: httpSuccess, data: result })
    } catch (error) {
      console.log(error)
      throw httpErrors[500]
    }
  }

  async listDetailsByEvent(req, res) {
    try {
      const { eventId } = req.params
      const result = await eventDetilsModel.model.find({ eventId: eventId })
      if (!result) throw httpErrors[500]
      return res.status(200).send({ message: httpSuccess, data: result })
    } catch (error) {
      console.log(error)
      throw httpErrors[500]
    }
  }

  async completedEvent(req, res) {
    try {
      const { memberId } = req.params
      const result = await eventDetilsModel.model.find({ memberId: memberId, paymentStatus: 'Done' }).populate([{ path: "memberId", populate: { path: "userId" } }, { path: "eventId" }])
      if (!result) throw httpErrors[500]
      return res.status(200).send({ message: httpSuccess, data: result })
    } catch (error) {
      console.log(error)
      throw httpErrors[500]
    }
  }

  async pendingEvent(req, res) {
    try {
      const { memberId, eventId } = req.body
      const result = await eventDetilsModel.model.findOne({ memberId: memberId, eventId: eventId }).populate([{ path: "memberId", populate: { path: "userId" } }, { path: "eventId" }])
      if (!result) throw httpErrors[500]
      return res.status(200).send({ message: httpSuccess, data: result })
    } catch (error) {
      console.log(error)
      throw httpErrors[500]
    }
  }
  async eventParticipants(req, res) {
    try {
      const { societyId, eventId } = req.body
      const result = await eventDetilsModel.model.find({ eventId: eventId, societyId: societyId, paymentStatus: 'Done' }).populate([{ path: "memberId", populate: [{ path: "userId" }, { path: "unit" }, { path: "wing" }] }, { path: "eventId" }])
      if (!result) throw httpErrors[500]
      return res.status(200).send({ message: httpSuccess, data: result })
    } catch (error) {
      console.log(error)
      throw httpErrors[500]
    }
  }

  async getEventDetailsById(req, res) {
    try {
      const { id } = req.params
      // const { societyId, memberId, eventId } = req.body
      const result = await eventDetilsModel.model.findOne({ _id: id }).populate([{ path: "memberId", populate: { path: "userId" } }, { path: "eventId" }])
      // const result = await eventDetilsModel.model.find({ societyId: societyId, eventId: eventId, memberId: memberId })
      if (!result) throw httpErrors[500]
      return res.status(200).send({ message: httpSuccess, data: result })
    } catch (error) {
      console.log(error)
      throw httpErrors[500]
    }
  }

  async updateEventDetails(req, res) {
    try {
      const { eventId, memberId, societyId } = req.body
      if (!eventId || !memberId || !paymentDate || !societyId) throw httpErrors[400]
      const result = await eventDetilsModel.model.findOneAndUpdate({
        societyId: societyId,
        eventId: eventId,
        memberId: memberId
      }, {
        paymentMethod: "Cash",
        paymentStatus: "Done",
        paymentDate: paymentDate,
      })
      if (!result) throw httpErrors[500]
      return res.status(200).send({ message: httpSuccess })
    } catch (error) {
      console.log(error)
      throw httpErrors[500]
    }
  }


  verifyPayment = async (req, res) => {
    try {
      const { razorpay_payment_id, razorpay_order_id, razorpay_signature, eventId, memberId } = req.body;
      // Verify Razorpay signature
      const body = `${razorpay_order_id}|${razorpay_payment_id}`;
      const expectedSignature = crypto
        .createHmac("sha256", razorpay.key_secret)
        .update(body)
        .digest("hex");
      if (expectedSignature !== razorpay_signature) {
        throw httpErrors[400];
      }

      // Update payment status in database
      const result = await eventDetilsModel.model.updateOne(
        { eventId: eventId, memberId: memberId },
        { paymentStatus: "Done", paymentMethod: "Online", paymentDate: paymentDate }
      );
      if (!result || result.modifiedCount <= 0) throw httpErrors[500];
      const member = await memberModel.model.findOne({ _id: memberId }).populate({ path: "userId" })
      const notify = await notificationModel.model.create({
        memberId: memberId,
        societyId: member?.societyId,
        uniqueId: eventId,
        title: "Pay Event funds",
        type: "Event",
        Description: `${member?.userId?.fullName} was pay his event funds Online on ${paymentDate} please checkout and print event bill`
      })
      if (!notify) throw httpErrors[500];
      res.status(200).send({ message: "Payment verified and updated successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).send({ error: "Payment verification failed" });
    }
  };
}


const eventDetilsController = new EventDetilsController()

module.exports = eventDetilsController