const express = require('express');
const securityProtocolController = require('./SecurityProtocolController.js')
const asyncHandler = require('express-async-handler')


const securityProtocolRouter = express.Router()

securityProtocolRouter.post('/createprotocol', asyncHandler(securityProtocolController.createProtocols))
securityProtocolRouter.get('/getprotocol/:societyId', asyncHandler(securityProtocolController.getSecurityProtocols))
securityProtocolRouter.delete('/deleteprotocol/:id', asyncHandler(securityProtocolController.deleteProtocols))
securityProtocolRouter.put('/updatesecurityprotocol/:id', asyncHandler(securityProtocolController.updateSecurityProtocol))

module.exports = securityProtocolRouter