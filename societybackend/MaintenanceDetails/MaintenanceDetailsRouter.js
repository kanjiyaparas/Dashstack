const { Router } = require('express')
const asyncHandler = require('express-async-handler');
const maintenanceDetailsController = require('./MaintenanceDetailsController');

const maintenanceDetailsRouter = Router()

maintenanceDetailsRouter.get("/member/:societyId", asyncHandler(maintenanceDetailsController.getUserMaintenanceDetails))

maintenanceDetailsRouter.post("/payment/verifyPayment", asyncHandler(maintenanceDetailsController.verifyPayment))

maintenanceDetailsRouter.get("/pending/:memberId", asyncHandler(maintenanceDetailsController.pendingMaintenance))

maintenanceDetailsRouter.get("/due/:memberId", asyncHandler(maintenanceDetailsController.dueMaintenance))

maintenanceDetailsRouter.get("/complete/:memberId", asyncHandler(maintenanceDetailsController.completedMaintenance))

maintenanceDetailsRouter.get("/pending/:memberId", asyncHandler(maintenanceDetailsController.pendingMaintenance))

maintenanceDetailsRouter.get("/list/:id", asyncHandler(maintenanceDetailsController.getMaintenanceDetailsByMember))

maintenanceDetailsRouter.put("/update", asyncHandler(maintenanceDetailsController.updateMaintenanceDetails))

maintenanceDetailsRouter.get("/getlist/:societyId" , asyncHandler(maintenanceDetailsController.getallpendingmaintenance))
module.exports = maintenanceDetailsRouter