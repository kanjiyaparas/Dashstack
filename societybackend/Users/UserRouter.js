const { Router } = require("express");
const asyncHandler = require('express-async-handler');
const userController = require("./UserController");

const userRouter = Router()

userRouter.post("/auth", asyncHandler(userController.authenticationPermission))
userRouter.post("/login", asyncHandler(userController.loginUser))
userRouter.post('/sendotp', asyncHandler(userController.sendResetPasswordOTP))
userRouter.post("/verify", asyncHandler(userController.verifyotp))
userRouter.post('/updatepassword', asyncHandler(userController.updatepassword))
userRouter.post('/resendotp', asyncHandler(userController.resendotp))
module.exports = userRouter