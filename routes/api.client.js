const express = require('express')
const router = express.Router()
const ClientController = require('../controllers/client')
const isAuthenticateWithToken = require('../middleware/isAuthenticateWithToken')

router.post('/', isAuthenticateWithToken, ClientController.create)
router.get('/', isAuthenticateWithToken, ClientController.findMany)
router.get('/:clientId', isAuthenticateWithToken, ClientController.findOne)
router.post('/update/:clientId', isAuthenticateWithToken, ClientController.update)
router.delete('/delete', isAuthenticateWithToken, ClientController.delete)

module.exports = router;
