const { httpErrors, httpSuccess } = require("../constents")
const securityModel = require("../Security/SecurityModel")
const memberModel = require("../Society Member/MemberModel")
const societyHandlerController = require("../SocietyHandler/SocietyHandlerController")
const societyHandlerModel = require("../SocietyHandler/SocietyHandlerModel")
const userModel = require("./UserModel")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const crypto = require('crypto')
const { log } = require("console")
const sendEmail = require("../mailconfig/Nodemailer")

class UserController {
  async loginUser(req, res) {
    try {
      const { email, password } = req.body
      if (!email || !password) throw httpErrors[400]
      let user
      if (email.length === 10 && typeof (Number(email) === "Number")) {
        const phone = Number(email)
        user = await userModel.model.findOne({ phoneNumber: phone })
        if (!user) throw httpErrors[500]
      } else {
        user = await userModel.model.findOne({ email: email })
        if (!user) throw httpErrors[500]
      }
      let societyData
      if (user.role === "Chairman") {
        societyData = await societyHandlerModel.model.findOne({ userId: user._id })
      } else if (user.role === "Member") {
        societyData = await memberModel.model.findOne({ userId: user._id })
      } else if (user.role === "Security") {
        societyData = await securityModel.model.findOne({ userId: user._id })
      }
      const payload = { ...user._doc, societyData: societyData }
      if (!bcrypt.compareSync(password, user.password)) return res.status(500).send({ message: "Invalid Password" })
      const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "30d" })
      if (!token) throw httpErrors[500]
      return res.status(200).send({ message: httpSuccess, token })
    } catch (error) {
      console.log(error)
      throw httpErrors[500]
    }
  }

  async sendResetPasswordOTP(req, res) {
    try {
      const { email } = req.body;
      if (!email) return res.status(400).send({ message: "Email is required" });

      const user = await userModel.model.findOne({ email: email })
      if (!user) return res.status(400).send({ message: 'User Not Found' })

      const otp = crypto.randomInt(100000, 999999);
      const otpExpiry = Date.now() + 30 * 1000;

      const otpToken = jwt.sign({ otp, otpExpiry, email }, process.env.JWT_SECRET, { expiresIn: "30s" });

      const subject = 'Password Reset OTP'
      const text = `Your OTP for password reset is ${otp}. It will expire in 15 minutes.`
      sendEmail({ to: email, subject, text });

      return res.status(200).send({ message: "OTP sent to your email", data: otpToken });
    } catch (error) {
      console.error(error);
      return res.status(500).send({ message: "Error sending OTP" });
    }
  }

  async resendotp(req, res) {
    try {
      const { email } = req.body
      if (!email) return res.status(400).send({ message: 'Email is Required' })
      const user = await userModel.model.findOne({ email: email })
      if (!user) return res.status(400).send({ message: "User Not Found" })

      const otp = crypto.randomInt(100000, 999999);
      const otpExpiry = Date.now() + 30 * 1000;
      // req.session = { email, otp, expiry: otpExpiry };
      // console.log(req.session.otpData)
      req.session.email = email
      req.session.otp = otp
      req.session.expiry = otpExpiry

      const subject = 'Password Reset OTP'
      const text = `Your OTP for password reset is ${otp}. It will expire in 15 minutes.`
      sendEmail({ to: email, subject, text });

      return res.status(200).send({ message: "OTP sent to your email" });

    } catch (error) {
      console.log(error)
      return res.status(500).send({ message: 'internal server error' })
    }
  }

  async verifyotp(req, res) {
    try {
      const { otp, otpToken } = req.body
      if (!otp) return res.status(400).send({ message: 'OTP is Required' })
      const decoded = jwt.verify(otpToken, process.env.JWT_SECRET);

      const { otp: storedOtp, expiry } = decoded;

      if (expiry < Date.now()) {
        return res.status(400).send({ message: "OTP expired" });
      }

      if (Number(otp) !== storedOtp) {
        return res.status(400).send({ message: "Invalid OTP" });
      }

      res.status(200).send({ message: "OTP verified successfully" });

      // return res.status(200).send({ message: 'OTP verify SuccessFull' })

    } catch (error) {
      console.log(error)
      return res.status(500).send({ message: 'Error in verify OTP' })
    }
  }

  async updatepassword(req, res) {
    try {
      const { newPassword, email } = req.body
      if (!newPassword) return res.status(400).send({ message: 'Password Required' })

      const user = await userModel.model.findOne({ email: email })
      if (!user) return res.status(400).send({ message: 'user Not Found' })

      const salt = bcrypt.genSaltSync(10);
      const hashedPassword = bcrypt.hashSync(newPassword, salt);

      user.password = hashedPassword;
      await user.save();

      req.session.otpData = null;
      return res.status(200).send({ message: "Password updated successfully" });
    } catch (error) {
      console.error(error);
      return res.status(500).send({ message: "Error resetting password" });
    }
  }


  async authenticationPermission(req, res) {
    try {
      const { id, password } = req.body // id : Society Chairman Id
      const result = await userModel.model.findOne({ _id: id })
      if (!result) throw httpErrors[500]
      if (!bcrypt.compareSync(password, result.password)) return res.status(401).send({ message: "Invalid Password" })
      return res.status(200).send({ message: httpSuccess })
    } catch (error) {
      console.log(error)
      throw httpErrors[500]
    }
  }
}

const userController = new UserController();
module.exports = userController;
