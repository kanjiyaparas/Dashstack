const randomstring = require("randomstring");
const securityModel = require("../Security/SecurityModel.js")
const sendEmail = require("../mailconfig/Nodemailer");
const bcrypt = require("bcrypt");
const { uploadMedia, httpSuccess, httpErrors, extractPublicId } = require("../constents");
const userModel = require("../Users/UserModel.js");
const { cloudinary } = require("../cloudinaryConfig.js");

class SecurityController {
  async createSecurity(req, res) {
    try {
      const { fullName, email, phoneNumber, gender, shift, joiningDate, shiftTime, societyId } = req.body;
      let { profileImage, adharCardImage } = req.files;

      // console.log(profileImage[0].path.split('/').slice(-1)[0].split('.')[0])

      if (!societyId || !fullName || !email || !phoneNumber || !gender || !shift || !joiningDate || !shiftTime || !profileImage || !adharCardImage)
        throw httpErrors[400];

      let password = randomstring.generate({ length: 8, charset: "alphabetic" });
      const encryptedPass = bcrypt.hashSync(password, 5);
      if (!encryptedPass) throw httpErrors[500];
      const user = await userModel.model.create({ fullName, email, password: encryptedPass, phoneNumber, role: "Security" })
      if (!user) throw httpErrors[500]

      profileImage = profileImage[0].path;
      adharCardImage = adharCardImage[0].path;

      const text = `Dear ${fullName},

      We have generated a password for your account. Please use the following credentials to log in:
          **Password**: ${password}

For your security, we recommend changing your password once you log in. If you didn’t request this password, please contact our support team immediately.

Best regards,
Society-management-Team`;
      const subject = `Login Crediantial For Dashstack`;

      sendEmail({ to: email, subject, text });

      let data = {
        userId: user._id,
        gender,
        shift,
        joiningDate,
        shiftTime,
        societyId,
        profileImage,
        adharCardImage
      }
      const result = await securityModel.model.create({ ...data })
      if (!result) throw httpErrors[500]
      return res.status(200).send({ message: httpSuccess, data: result })
    } catch (error) {
      console.log(error);
      throw httpErrors[500];
    }
  }

  async getSecurity(req, res) {
    try {
      const { societyId } = req.params;

      const result = await securityModel.model.find({ societyId }).populate([{ path: 'societyId' }, { path: 'userId' }]);
      if (!result) throw httpErrors[400];

      return res.status(200).send({ message: httpSuccess, data: result });
    } catch (error) {
      console.log('Error:', error);
      throw httpErrors[500];
    }
  }


  async deleteSecurity(req, res) {
    try {
      const { id } = req.params
      if (!id) throw httpErrors[400]
      let data = await securityModel.model.findOne({ _id: id })
      if (!data) throw httpErrors[500]
      data = data._doc
      let userData = await userModel.model.deleteOne({ _id: data.userId })
      if (!userData && userData.deletedCount < 0) throw httpErrors[500]
      const result = await securityModel.model.deleteOne({ _id: id })
      if (!result || !result.deletedCount <= 0) throw httpErrors[400]
      return res.status(200).send({ message: httpSuccess })
    } catch (error) {
      console.log(error);
      throw httpErrors[500]
    }
  }

  async updateSecurity(req, res) {
    try {
      const { id } = req.params
      const { fullName, email, phoneNumber, gender, shift, joiningDate, shiftTime, societyId } = req.body;
      let profileImage
      let adharCardImage
      if (!id) throw httpErrors[400]
      let data = await securityModel.model.findOne({ _id: id })
      if (!data) throw httpErrors[500]
      data = data._doc
      const user = await userModel.model.findOneAndUpdate({ _id: data.userId }, { fullName, email, phoneNumber }, { new: true })
      if (!user) throw httpErrors[500]
      if (req.files?.profileImage) {
        profileImage = req.files?.profileImage[0].path
      } else {
        profileImage = data.profileImage
      }
      if (req.files?.adharCardImage) {
        adharCardImage = req.files?.adharCardImage[0].path
      } else {
        adharCardImage = data.adharCardImage
      }
      const updateData = {
        societyId: societyId,
        userId: user._id,
        gender: gender,
        shift: shift,
        joiningDate: joiningDate,
        shiftTime: shiftTime,
        profileImage: profileImage,
        adharCardImage: adharCardImage
      }
      const result = await securityModel.model.updateOne({ _id: id }, { ...updateData })
      if (!result && result.updatedCount < 0) throw httpErrors[400]
      return res.status(200).send({ message: httpSuccess })
    } catch (error) {
      console.log(error)
      throw httpErrors[500]
    }
  }
}

const securityController = new SecurityController();
module.exports = securityController;
