const { Router } = require('express')
const asyncHandler = require('express-async-handler');
const notificationController = require('./NotificationController');

const notificationRouter = Router()

notificationRouter.get("/list/:societyId", asyncHandler(notificationController.listNotify))
notificationRouter.delete("/delete/:id", asyncHandler(notificationController.deleteNotification))


module.exports = notificationRouter