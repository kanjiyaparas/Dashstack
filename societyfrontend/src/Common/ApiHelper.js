import axios from "axios"

class ApiHelper {
  constructor() {
    this.baseUrl = "https://dashstack-pxmh.onrender.com"
    // this.baseUrl = "http://localhost:5000"
  }
  loginUser(data) {
    return axios.post(this.baseUrl + "/user/login", data)
  }
  listMember(societyId) {
    return axios.get(this.baseUrl + "/member/" + societyId)
  }
  listSociety() {
    return axios.get(this.baseUrl + "/society/list")
  }
  createSociety(data) {
    return axios.post(this.baseUrl + "/society/create", data)
  }
  createUnit(data) {
    return axios.post(this.baseUrl + "/unit/create", data)
  }
  createChairman(data) {
    return axios.post(this.baseUrl + "/society-handler/create", data)
  }
  forgotpassword(data) {
    return axios.post(this.baseUrl + '/user/sendotp', data)
  }
  otpverify(data) {
    return axios.post(this.baseUrl + "/user/verify", data)
  }
  resendotp(data) {
    console.log(data)
    return axios.post(this.baseUrl + "/user/resendotp", data)
  }
  updatepassword(data) {
    return axios.post(this.baseUrl + '/user/updatepassword', data)
  }

  listWing(societyId) {
    return axios.get(this.baseUrl + "/wing/list/" + societyId)
  }
  listUnit(wingId) {
    return axios.get(this.baseUrl + "/unit/list/" + wingId)
  }
  createMember(data) {
    return axios.post(this.baseUrl + "/member/createMember", data)
  }
  updateMember(data) {
    return axios.post(this.baseUrl + '/member/update', data)
  }
  listMember(societyId) {
    return axios.get(this.baseUrl + "/member/" + societyId)
  }
  listByUnit(unitId) {
    return axios.get(this.baseUrl + "/member/listbyunit/" + unitId)
  }
  getMemberById(memberId) {
    return axios.get(this.baseUrl + "/member/list/" + memberId)
  }
  getmemberchat(societyId, excludeMemberId) {
    console.log(societyId)
    return axios.post(this.baseUrl + "/member/memberchat/" + societyId, {
      excludeMemberId,
    })
  }

  // Maintenance
  createMaintenance(data) {
    return axios.post(this.baseUrl + "/maintain/create", data)
  }
  listMaintenance(societyId) {
    return axios.get(this.baseUrl + "/maintain-detail/member/" + societyId)
  }
  alllistMaintenance(societyId){
    return axios.get(this.baseUrl + "/maintain-detail/getlist/"+ societyId)
  }
  dueMaintenance(memberId) {
    return axios.get(this.baseUrl + "/maintain-detail/due/" + memberId)
  }
  pendingMaintenance(memberId) {
    return axios.get(this.baseUrl + "/maintain-detail/pending/" + memberId)
  }
  completedMaintenance(memberId) {
    return axios.get(this.baseUrl + "/maintain-detail/complete/" + memberId)
  }
  getMaintenanceDetailsByMember(id) {
    return axios.get(this.baseUrl + "/maintain-detail/list/" + id)
  }
  updateMaintenanceDetails(data) {
    return axios.put(this.baseUrl + "/maintain-detail/update", data)
  }
  verifyPayment(data) {
    return axios.post(this.baseUrl + "/maintain-detail/payment/verifyPayment", data)
  }


  //event
  createEvent(data) {
    return axios.post(this.baseUrl + "/event/create", data)
  }
  getEvents(id) {
    return axios.get(this.baseUrl + "/event/" + id)
  }
  listevent(societyId) {
    console.log(societyId)
    return axios.get(this.baseUrl + "/event/listevent/" + societyId)
  }
  deleteEvent(id) {
    return axios.delete(this.baseUrl + '/event/delete/' + id)
  }
  updateevent(data) {
    return axios.put(this.baseUrl + "/event/update", data)
  }
  completedEvent(memberId) {
    return axios.get(this.baseUrl + "/event-details/complete/" + memberId)
  }
  pendingEvent(data) {
    return axios.post(this.baseUrl + "/event-details/pending", data)
  }
  eventParticipants(data) {
    return axios.post(this.baseUrl + "/event-details/participant", data)
  }
  getEventDetailsById(id) {
    return axios.get(this.baseUrl + "/event-details/listbymember/" + id)
  }
  updateEventDetails(data) {
    return axios.put(this.baseUrl + "/event-details/update", data)
  }
  eventverifyPayment(data) {
    return axios.post(this.baseUrl + "/event-details/payment/verifyPayment", data)
  }

  // expence

  createexpence(data) {
    return axios.post(this.baseUrl + '/expanse/create', data)
  }

  listexpence(societyId) {
    return axios.get(this.baseUrl + '/expanse/list/' + societyId)
  }

  updateexpence(expanseId, data) {
    return axios.put(this.baseUrl + '/expanse/update/' + expanseId, data)
  }

  deleteexpence(expanseId) {
    return axios.delete(this.baseUrl + '/expanse/delete/' + expanseId)
  }

  // Notes
  createNotes(data) {
    return axios.post(this.baseUrl + "/expanseNote/create", data)
  }
  listNotes(societyId) {
    return axios.get(this.baseUrl + '/expanseNote/list/' + societyId)
  }
  updateNote(societyId, data) {
    return axios.put(this.baseUrl + "/expanseNote/update/" + societyId, data)
  }
  deleteNote(id) {
    return axios.delete(this.baseUrl + "/expanseNote/delete/" + id)
  }
  // facility
  createFacility(data) {
    return axios.post(this.baseUrl + '/facility/addfacility', data)
  }
  listFacility(societyId) {
    return axios.get(this.baseUrl + '/facility/getfacility/' + societyId)
  }
  editFacility(id, data) {
    return axios.put(this.baseUrl + '/facility/updatefacility/' + id, data)
  }

  //Complaint
  createComplaint(data) {
    return axios.post(this.baseUrl + '/complain/create', data)
  }
  listAllComplain(data) {
    return axios.post(this.baseUrl + '/complain/list', data)
  }
  getComplainById(data) {
    return axios.post(this.baseUrl + '/complain/listById', data)
  }
  updateComplaint(id, data) {
    return axios.put(this.baseUrl + '/complain/update/' + id, data)
  }
  updateComplaintStatus(data) {
    return axios.put(this.baseUrl + '/complain/status/update', data)
  }
  deleteComplaint(id) {
    return axios.delete(this.baseUrl + '/complain/delete/' + id)
  }

  // securityprotocol

  createsecurityProtocol(data) {
    return axios.post(this.baseUrl + '/securityprotocol/createprotocol', data)
  }

  listsecurityProtocol(societyId) {
    return axios.get(this.baseUrl + '/securityprotocol/getprotocol/' + societyId)
  }

  updatesecurityProtocol(id, data) {
    return axios.put(this.baseUrl + `/securityprotocol/updatesecurityprotocol/${id}`, data)
  }
  deletesecurityProtocol(id) {
    return axios.delete(this.baseUrl + `/securityprotocol/deleteprotocol/${id}`)
  }

  // visitor

  listvisitor(societyId) {
    return axios.get(this.baseUrl + '/visitor/getvisitor/' + societyId)
  }

  createvisitor(data) {
    return axios.post(this.baseUrl + '/visitor/createvisitor', data)
  }

  createemergency(data) {
    return axios.post(this.baseUrl + '/visitor/createemergency', data)
  }

  // Annoncement
  createAnnouncement(data) {
    return axios.post(this.baseUrl + '/announcement/create', data)
  }
  listAnnouncement(societyId) {
    return axios.get(this.baseUrl + '/announcement/list/' + societyId)
  }
  updateAnnouncement(id, data) {
    return axios.put(this.baseUrl + '/announcement/update/' + id, data)
  }
  deleteAnnouncement(id) {
    return axios.delete(this.baseUrl + "/announcement/delete/" + id)
  }

  // Security Gaurd
  createGaurd(data) {
    return axios.post(this.baseUrl + "/security/createsecurity", data)
  }
  listGaurd(societyId) {
    return axios.get(this.baseUrl + '/security/getsecurity/' + societyId)
  }
  editGaurd(id, data) {
    return axios.put(this.baseUrl + '/security/updatesecurity/' + id, data)
  }
  deleteGaurd(id) {
    return axios.delete(this.baseUrl + '/security/deletesecurity/' + id)
  }

  //get image details
  imageDetails(data) {
    return axios.post(this.baseUrl + '/image-details', data)
  }

  // Notification
  listNotification(societyId) {
    return axios.get(this.baseUrl + '/notify/list/' + societyId)
  }
  deleteNotification(id) {
    return axios.delete(this.baseUrl + '/notify/delete/' + id)
  }

  // important number
  createnumber(data) {
    return axios.post(this.baseUrl + '/workernumber/create', data)
  }
  getnumber(societyId) {
    return axios.get(this.baseUrl + '/workernumber/list/' + societyId)
  }
  updatenumber(id) {
    return axios.put(this.baseUrl + '/workernumber/updateimportantnumber/' + id)
  }
  deletenumber(id) {
    return axios.delete(this.baseUrl + '/workernumber/delete/' + id)
  }

}

const apiHelper = new ApiHelper()
export default apiHelper