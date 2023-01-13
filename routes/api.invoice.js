const express = require('express')
const router = express.Router()
const InvoiceController = require('../controllers/invoice')
const isAuthenticateWithToken = require('../middleware/isAuthenticateWithToken')

router.post('/', isAuthenticateWithToken, InvoiceController.create)
router.get('/', isAuthenticateWithToken, InvoiceController.findMany)
router.get('/:invoiceId', isAuthenticateWithToken, InvoiceController.findOne)
router.put('/update/:invoiceId', isAuthenticateWithToken, InvoiceController.update)
router.delete('/:invoiceId', isAuthenticateWithToken, InvoiceController.delete)

module.exports = router;