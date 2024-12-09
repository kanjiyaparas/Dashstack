const { httpErrors, httpSuccess, key_id, key_secrate } = require("../constents")
const maintenanceDetailsModel = require("../MaintenanceDetails/MaintenanceDetailsModel")
const memberModel = require("../Society Member/MemberModel")
const maintenanceModel = require("./MaintenanceModel")
const Razorpay = require("razorpay");

const razorpay = new Razorpay({
  key_id: key_id, // Replace with your Razorpay Key ID
  key_secret: key_secrate, // Replace with your Razorpay Key Secret
});

class MaintenanceController {

  async createMaintenance(req, res) {
    try {
      let { societyId, maintenanceAmount, penaltyAmount, dueDays, dueDate } = req.body;
      if (!societyId || !maintenanceAmount || !penaltyAmount || !dueDate || !dueDays) throw httpErrors[400];
      dueDate = new Date(dueDate)
      dueDays = Number(dueDays)
      const result = await maintenanceModel.model.create({ ...req.body })
      if (!result) throw httpErrors[500]
      const penaltyDate = result.dueDate;
      penaltyDate.setDate(penaltyDate.getDate() + result.dueDays);
      // penaltyDate.setMinutes(penaltyDate.getMinutes() + 1);

      const societyMembers = await memberModel.model.find({ societyId: societyId })
      var razorpayOrder
      await Promise.all(
        societyMembers.map(async (data) => {
          razorpayOrder = await razorpay.orders.create({
            amount: result.maintenanceAmount * 100, // Convert to paise
            currency: "INR",
            receipt: `receipt_${result?._id}`,
          });
          if (!razorpayOrder) {
            throw new Error("Failed to create Razorpay order");
          }
          // Create maintenance details for each member
          const maintenanceDetails = await maintenanceDetailsModel.model.create({
            societyId,
            maintenanceId: result._id,
            memberId: data._id,
            amount: maintenanceAmount,
            paymentDate: result.dueDate,
            razorpayOrderId: razorpayOrder.id,
          });
          if (!maintenanceDetails) {
            throw new Error(`Failed to create maintenance details for member ID: ${data._id}`);
          }

          // Schedule the penalty job after successful creation
          await maintenanceDetailsModel.schedulePenaltyJob(maintenanceDetails._id, penaltyDate, penaltyAmount);
        })
      );
      // Step 1: Create Razorpay order


      if (!result) throw httpErrors[500];

      // Step 3: Respond with Razorpay order details
      return res.status(200).send({
        message: "Maintenance details created successfully",
        razorpayOrderId: razorpayOrder.id,
        razorpayKey: razorpay.key_id, // Send the Razorpay key to the client for initializing Razorpay checkout
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
      });
    } catch (error) {
      console.error(error);
      res.status(500).send({ error: "Failed to create maintenance details" });
    }
  }
  async maintenanceAmount(req, res) {
    try {
      const result = await maintenanceModel.model.find()
      let MaintenanceAmount
      for (let i = 0; i < result.length; i++) {
        MaintenanceAmount += result[i].maintenanceAmount
      }
      return res.status(200).send({ message: httpSuccess, data: MaintenanceAmount })
    } catch (error) {
      console.log(error)
      throw httpErrors[500]
    }
  }
  async penaltyAmount(req, res) {
    try {
      const result = await maintenanceModel.model.find()
      let PenaltyAmount
      for (let i = 0; i < result.length; i++) {
        PenaltyAmount += result[i].penaltyAmount
      }
      return res.status(200).send({ message: httpSuccess, data: PenaltyAmount })
    } catch (error) {
      console.log(error)
      throw httpErrors[500]
    }
  }
}

const maintenanceController = new MaintenanceController()
module.exports = maintenanceController