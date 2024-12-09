const { uploadMedia, httpSuccess, httpErrors } = require("../constents");
const memberModel = require("./MemberModel");
const randomstring = require("randomstring");
const sendEmail = require("../mailconfig/Nodemailer");
const bcrypt = require("bcrypt");
const userModel = require("../Users/UserModel");

class MemberController {
  async createMember(req, res) {
    try {
      let { societyId, residentStatus, fullName, email, phoneNumber, age, wing, unit, familyMember, vehicle, OwnerInfo } = req.body;
      let { profileImage, aadharFront, aadharBack, veraBill, agreement } = req.files;
      if (!societyId || !residentStatus || !fullName || !email || !phoneNumber || !age || !wing || !unit || !profileImage || !aadharFront || !aadharBack || !veraBill || !agreement || !familyMember || !vehicle) throw httpErrors[400];
      if (residentStatus === "Tenant" && !OwnerInfo) throw httpErrors[400];
      familyMember = JSON.parse(familyMember);
      vehicle = JSON.parse(vehicle);
      phoneNumber = Number(phoneNumber);
      age = Number(age);
      familyMember = familyMember.map((member) => ({
        ...member,
        age: Number(member.age),
        phoneNumber: Number(member.phoneNumber),
      }));
      let password = randomstring.generate({ length: 8, charset: "alphabetic" });
      const encryptedPass = bcrypt.hashSync(password, 5);
      if (!encryptedPass) throw httpErrors[500];

      const user = await userModel.model.create({ fullName, email, password: encryptedPass, phoneNumber, role: "Member" })
      if (!user) throw httpErrors[500]

      profileImage = profileImage[0].path;
      aadharFront = aadharFront[0].path;
      aadharBack = aadharBack[0].path;
      veraBill = veraBill[0].path;
      agreement = agreement[0].path;

      const text = `Dear ${fullName},

             We have generated a password for your account. Please use the following credentials to log in:
                 **Password**: ${password}

       For your security, we recommend changing your password once you log in. If you didn’t request this password, please contact our support team immediately.

       Best regards,
       Society-management-Team`;
      const subject = `Login Crediantial For Dashstack`;

      sendEmail({ to: email, subject, text });

      let result;
      const data = {
        userId: user._id,
        residentStatus,
        age,
        wing,
        unit,
        familyMember,
        vehicle,
        profileImage,
        aadharFront,
        aadharBack,
        veraBill,
        agreement,
        societyId: societyId
      };
      if (residentStatus === "Tenant") {
        OwnerInfo = JSON.parse(OwnerInfo);
        result = await memberModel.model.create({ ...data, OwnerInfo: OwnerInfo });
        if (!result) throw httpErrors[500];
      } else {
        result = await memberModel.model.create({ ...data });
        if (!result) throw httpErrors[500];
      }
      return res.status(200).send({ message: httpSuccess });
    } catch (error) {
      console.log(error);
      throw httpErrors[500];
    }
  }

  async listMember(req, res) {
    try {
      const { societyId } = req.params
      const Member = await memberModel.model.find({ societyId: societyId }).populate([{ path: "userId" }, { path: "wing" }, { path: "unit" }])
      if (!Member) throw httpErrors[500];
      return res.status(200).send({ message: httpSuccess, data: Member });
    } catch (error) {
      console.log(error);
      throw httpErrors[500];
    }
  }

  // async getmemberforchat(req, res) {
  //   try {
  //     const { societyId } = req.params
  //     const result = await memberModel.model.find({ societyId: societyId }, { userId: 1, profileImage: 1 }).populate('userId')

  //     if (!result) throw httpErrors[400]

  //     return res.status(200).send({ message: httpSuccess, data: result })
  //   } catch (error) {
  //     console.log(error)
  //     throw httpErrors[500]
  //   }
  // }

  async getmemberforchat(req, res) {
    try {
      const { societyId } = req.params;
      console.log(req.body)
      const { excludeMemberId } = req.body;

      const result = await memberModel.model.find(
        { societyId: societyId, userId: { $ne: excludeMemberId } },
        { userId: 1, profileImage: 1 }
      ).populate('userId');

      if (!result) throw httpErrors[400];

      return res.status(200).send({ message: httpSuccess, data: result });
    } catch (error) {
      console.log(error);
      throw httpErrors[500];
    }
  }


  async listMemberByWing(req, res) {
    try {
      const { wingId } = req.params
      const Member = await memberModel.model.find({ wing: wingId }).populate([{ path: "userId" }, { path: "wing" }, { path: "unit" }])
      if (!Member) throw httpErrors[500];
      return res.status(200).send({ message: httpSuccess, data: Member });
    } catch (error) {
      console.log(error);
      throw httpErrors[500];
    }
  }
  async listMemberByUnit(req, res) {
    try {
      const { unitId } = req.params
      const Member = await memberModel.model.findOne({ unit: unitId }).populate([{ path: "userId" }, { path: "wing" }, { path: "unit" }])
      if (!Member) throw httpErrors[500];
      return res.status(200).send({ message: httpSuccess, data: Member });
    } catch (error) {
      console.log(error);
      throw httpErrors[500];
    }
  }

  async getMemberById(req, res) {
    try {
      const { memberId } = req.params
      const Member = await memberModel.model.findOne({ _id: memberId }).populate([{ path: "userId" }, { path: "wing" }, { path: "unit" }])
      if (!Member) throw httpErrors[500];
      return res.status(200).send({ message: httpSuccess, data: Member });
    } catch (error) {
      console.log(error);
      throw httpErrors[500];
    }
  }

  async updateMember(req, res) {
    try {
      let { residentStatus, unitStatus, fullName, email, phoneNumber, age, wing, unit, familyMember, vehicle, OwnerInfo, memberId } = req.body;
      let { profileImage, aadharFront, aadharBack, veraBill, agreement } = req.files;

      // console.log(req.body, ">>>>>>>>body");
      // console.log(req.files, "---------files");

      if (!memberId || !residentStatus || !unitStatus || !fullName || !email || !phoneNumber || !age || !wing || !unit || !familyMember || !vehicle) throw httpErrors[400];
      if (residentStatus === "Tenant" && !OwnerInfo) throw httpErrors[400];

      familyMember = JSON.parse(familyMember);
      vehicle = JSON.parse(vehicle);
      phoneNumber = Number(phoneNumber);
      age = Number(age);
      familyMember = familyMember.map((member) => ({
        ...member,
        age: Number(member.age),
        phoneNumber: Number(member.phoneNumber),
      }));

      const member = await memberModel.model.findOne({ _id: memberId });
      if (!member) throw httpErrors[404]; // Member not found

      const user = await userModel.model.findOneAndUpdate(
        { _id: member.userId },
        { fullName, email, phoneNumber, role: "Member" },
        { new: true }
      );
      if (!user) throw httpErrors[500];

      // Update file paths only if new files are provided
      profileImage = profileImage ? profileImage[0].path : member.profileImage;
      aadharFront = aadharFront ? aadharFront[0].path : member.aadharFront;
      aadharBack = aadharBack ? aadharBack[0].path : member.aadharBack;
      veraBill = veraBill ? veraBill[0].path : member.veraBill;
      agreement = agreement ? agreement[0].path : member.agreement;

      const text = `Dear ${fullName},

             We have updated your account details. Please review your updated information and contact support if you have any questions.

       Best regards,
       Society-management-Team`;
      const subject = `Account Details Updated`;

      sendEmail({ to: email, subject, text })

      const updatedData = {
        userId: user._id,
        residentStatus,
        unitStatus,
        age,
        wing,
        unit,
        familyMember,
        vehicle,
        profileImage,
        aadharFront,
        aadharBack,
        veraBill,
        agreement,
      };

      let result;
      if (residentStatus === "Tenant") {
        OwnerInfo = JSON.parse(OwnerInfo);
        result = await memberModel.model.findByIdAndUpdate(memberId, { ...updatedData, OwnerInfo: OwnerInfo }, { new: true });
      } else {
        result = await memberModel.model.findByIdAndUpdate(memberId, updatedData, { new: true });
      }
      if (!result) throw httpErrors[500];

      return res.status(200).send({ message: httpSuccess });
    } catch (error) {
      console.log(error);
      throw httpErrors[500];
    }
  }

}

const memberController = new MemberController();

module.exports = memberController;
