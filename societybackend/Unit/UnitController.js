const { httpErrors, httpSuccess } = require("../constents")
const societyModel = require("../Society/SocietyModel")
const wingModel = require("../Wing/WingModel")
const unitModel = require("./UnitModel")

class UnitController {
  async createUnit(req, res) {
    try {
      let { unitCount, series, societyId, floor } = req.body
      if (floor == 0) {
        floor = 1
      }
      if (!unitCount || !societyId || !series || !floor) throw httpErrors[400]
      let Block
      const societyData = await societyModel.model.findOne({ _id: societyId })
      if (!societyData) throw httpErrors[500]
      const Wing = await wingModel.model.find({ societyId: societyId }).populate('societyId')
      if (!Wing) throw httpErrors[500]
      if (societyData.societyType === "tenement") {
        for (let i = 0; i < Wing?.length; i++) {
          for (let j = 0; j < unitCount; j++) {
            if (series !== 1) {
              Block = await unitModel.model.create({
                unitNumber: ((i + 1) * series) + j + 1,
                wingId: Wing[i]._id,
                societyId: societyId
              })
              if (!Block) throw httpErrors[500]
            } else {
              Block = await unitModel.model.create({
                unitNumber: i === 0 ? i + j + 1 : j + 1,
                wingId: Wing[i]._id,
                societyId: societyId
              })
              if (!Block) throw httpErrors[500]
            }
          }
        }
      } else {
        for (let i = 0; i < Wing.length; i++) {
          for (let j = 0; j < floor; j++) {
            for (let k = 0; k < unitCount; k++) {
              Block = await unitModel.model.create({
                unitNumber: ((j + 1) * series) + k + 1,
                wingId: Wing[i]._id,
                societyId: societyId
              })
              if (!Block) throw httpErrors[500]
            }
          }
        }
      }
      return res.status(200).send({ message: httpSuccess })
    } catch (error) {
      console.log(error)
      throw httpErrors[500]
    }
  }

  async listUnit(req, res) {
    try {
      const { wingId } = req.params
      const result = await unitModel.model.find({ wingId: wingId }).populate({ path: "wingId" })
      if (!result) throw httpErrors[400]
      return res.status(200).send({ message: httpSuccess, data: result })
    } catch (error) {
      console.log(error)
      throw httpErrors[500]
    }
  }

  async getUnitById(req, res) {
    try {
      const { id } = req.params
      const result = await unitModel.model.findOne({ _id: id })
      if (!result) throw httpErrors[400]
      return res.status(200).send({ message: httpSuccess, data: result })
    } catch (error) {
      console.log(error)
      throw httpErrors[500]
    }
  }

  async deleteUnitById(req, res) {
    try {
      const { id } = req.params
      const result = await unitModel.model.deleteOne({ _id: id })
      if (!result || result.deletedCount <= 0) throw httpErrors[400]
      return res.status(200).send({ message: httpSuccess })
    } catch (error) {
      console.log(error)
      throw httpErrors[500]
    }
  }
}

const unitController = new UnitController()
module.exports = unitController