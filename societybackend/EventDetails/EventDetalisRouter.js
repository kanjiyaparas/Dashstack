const { Router } = require('express')
const asyncHandler = require('express-async-handler');
const eventDetilsController = require('./EventDetailsController');

const eventDetailsRouter = Router()
eventDetailsRouter.post("/create", asyncHandler(eventDetilsController.addeventmember))
eventDetailsRouter.put("/update", asyncHandler(eventDetilsController.updateEventDetails))
eventDetailsRouter.get("/:societyId", asyncHandler(eventDetilsController.listEventDetails))
eventDetailsRouter.get("/list/:eventId", asyncHandler(eventDetilsController.listDetailsByEvent))
eventDetailsRouter.get("/listbymember/:id", asyncHandler(eventDetilsController.getEventDetailsById))
// eventDetailsRouter.post("/listbymember", asyncHandler(eventDetilsController.getEventDetailsById))
eventDetailsRouter.get("/complete/:memberId", asyncHandler(eventDetilsController.completedEvent))
eventDetailsRouter.post("/pending", asyncHandler(eventDetilsController.pendingEvent))
eventDetailsRouter.post("/participant", asyncHandler(eventDetilsController.eventParticipants))
eventDetailsRouter.post("/payment/verifyPayment", asyncHandler(eventDetilsController.verifyPayment))

module.exports = eventDetailsRouter