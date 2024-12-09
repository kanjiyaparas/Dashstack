const { httpErrors, httpSuccess, key_id, key_secrate } = require("../constents")
const maintenanceModel = require("../Maintenance/MaintenanceModel.js");
const notificationModel = require("../Notification/NotificationModel.js");
const maintenanceDetailsModel = require('./MaintenanceDetailsModel.js')
const crypto = require("crypto")
const Razorpay = require("razorpay");
const memberModel = require("../Society Member/MemberModel.js");
const { default: mongoose } = require("mongoose");

const paymentDate = new Date()

const razorpay = new Razorpay({
  key_id: key_id, // Replace with your Razorpay Key ID
  key_secret: key_secrate, // Replace with your Razorpay Key Secret
});

class MaintenanceDetailsController {
  async createMaintenanceDetails(req, res) {
    try {
      const { maintenanceId, memberId, amount, penaltyAmount, paymentStatus, paymentMethod, paymentDate, societyId } = req.body
      if (!maintenanceId || !memberId || !amount || !penaltyAmount || !paymentStatus || !paymentMethod || !paymentDate || !societyId) throw httpErrors[400]
      const result = await maintenanceDetailsModel.model.create({ ...req.body })
      return res.status(200).send({ message: httpSuccess })
    } catch (error) {
      console.log(error)
      throw httpErrors[500]
    }
  }

  async getUserMaintenanceDetails(req, res) {
    try {
      const { societyId } = req.params
      const result = await maintenanceDetailsModel.model.find({ societyId: societyId }).populate([
        { path: "maintenanceId" },
        {
          path: "memberId", populate: [
            { path: "userId" },
            { path: "wing" },
            { path: "unit" },
          ]
        },
      ])
      if (!result) throw httpErrors[500]
      return res.status(200).send({ message: httpSuccess, data: result })
    } catch (error) {
      console.log(error)
      throw httpErrors[500]
    }
  }

  async getMaintenanceDetailsByMember(req, res) {
    try {
      const { id } = req.params
      const result = await maintenanceDetailsModel.model.findOne({ _id: id }).populate([{ path: "memberId", populate: { path: "userId" } }, { path: "maintenanceId" }])
      if (!result) throw httpErrors[500]
      return res.status(200).send({ message: httpSuccess, data: result })
    } catch (error) {
      console.log(error)
      throw httpErrors[500]
    }
  }

  async dueMaintenance(req, res) {
    try {
      const { memberId } = req.params
      const result = await maintenanceDetailsModel.model.find({ memberId: memberId, paymentStatus: "Pending" }).populate([{ path: "memberId", populate: { path: "userId" } }, { path: "maintenanceId" }])
      if (!result) throw httpErrors[500]
      return res.status(200).send({ message: httpSuccess, data: result })
    } catch (error) {
      console.log(error)
      throw httpErrors[500]
    }
  }

  async pendingMaintenance(req, res) {
    try {
      const { memberId } = req.params
      const result = await maintenanceDetailsModel.model.find({ memberId: memberId, penaltyAmount: { $gt: 0 } }).populate({ path: "memberId", populate: { path: "userId" } })
      if (!result) throw httpErrors[500]
      return res.status(200).send({ message: httpSuccess, data: result })
    } catch (error) {
      console.log(error)
      throw httpErrors[500]
    }
  }

  async completedMaintenance(req, res) {
    try {
      const { memberId } = req.params
      const result = await maintenanceDetailsModel.model.find({ memberId: memberId, paymentStatus: 'Done' }).populate([{ path: "memberId", populate: { path: "userId" } }, { path: "maintenanceId" }])
      if (!result) throw httpErrors[500]
      return res.status(200).send({ message: httpSuccess, data: result })
    } catch (error) {
      console.log(error)
      throw httpErrors[500]
    }
  }

  async pendingMaintenance(req, res) {
    try {
      const { memberId } = req.params
      const result = await maintenanceDetailsModel.model.find({ memberId: memberId, paymentStatus: 'Pending' }).populate([{ path: "memberId", populate: { path: "userId" } }, { path: "maintenanceId" }])
      if (!result) throw httpErrors[500]
      return res.status(200).send({ message: httpSuccess, data: result })
    } catch (error) {
      console.log(error)
      throw httpErrors[500]
    }
  }

  async updateMaintenanceDetails(req, res) {
    try {
      const { maintenanceId, memberId, societyId } = req.body
      if (!maintenanceId || !memberId || !societyId) throw httpErrors[400]
      const result = await maintenanceDetailsModel.model.findOneAndUpdate({
        societyId: societyId,
        maintenanceId: maintenanceId,
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
      const { razorpay_payment_id, razorpay_order_id, razorpay_signature, maintenanceId, memberId, paymentDate } = req.body;
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
      const result = await maintenanceDetailsModel.model.updateOne(
        { _id: maintenanceId, memberId: memberId },
        { paymentStatus: "Done", paymentMethod: "Online", paymentDate: paymentDate }
      );
      if (!result || result.modifiedCount <= 0) throw httpErrors[500];
      const member = await memberModel.model.findOne({ _id: memberId }).populate({ path: "userId" })
      const notify = await notificationModel.model.create({
        memberId: memberId,
        societyId: member?.societyId,
        uniqueId: maintenanceId,
        title: "Pay Maintenance",
        type: "Maintenance",
        Description: `${member?.userId?.fullName} was pay his maintenance Online on ${paymentDate} please checkout and print maintenance bill`
      })
      if (!notify) throw httpErrors[500];
      res.status(200).send({ message: "Payment verified and updated successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).send({ error: "Payment verification failed" });
    }
  };


}

const maintenanceDetailsController = new MaintenanceDetailsController()
module.exports = maintenanceDetailsController