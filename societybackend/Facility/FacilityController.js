const { httpSuccess, httpErrors } = require('../constents')
const facilityModel = require('./FacilityModel')


class FacilityController {
  async createfacility(req, res) {
    try {
      const { societyId, facilityName, description, serviceDate, remindBefore } = req.body

      if (!societyId || !facilityName || !description || !serviceDate || !remindBefore) throw httpErrors[400]

      const result = await facilityModel.model.create({ ...req.body })
      if (!result) throw httpErrors[400]
      return res.status(200).send({ message: httpSuccess, data: result })
    } catch (error) {
      console.log(error);
      throw httpErrors[500]
    }
  }

  async getfacility(req, res) {
    try {
      const { societyId } = req.params
      const result = await facilityModel.model.find({ societyId: societyId })
      if (!result) throw httpErrors[400]
      return res.status(200).send({ message: httpSuccess, data: result })
    } catch (error) {
      console.log(error);
      throw httpErrors[500]
    }
  }

  async updatefacility(req, res) {
    try {
      const { id } = req.params
      if (!id) throw httpErrors[400]
      const result = await facilityModel.model.updateOne({ _id: id }, { ...req.body })
      if (!result && result.updatedCount < 0) throw httpErrors[500]
      return res.status(200).send({ message: httpSuccess })
    } catch (error) {
      console.log(error);
      throw httpErrors[500]
    }
  }
}

const facilitycontroller = new FacilityController()

module.exports = facilitycontroller