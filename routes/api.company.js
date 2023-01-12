const express = require('express')
const router = express.Router()
const CompanyController = require('../controllers/company')
const isAuthenticateWithToken = require('../middleware/isAuthenticateWithToken')


router.post('/', isAuthenticateWithToken, CompanyController.create)
router.get('/my', isAuthenticateWithToken, CompanyController.findOne)
router.post('/update', isAuthenticateWithToken, CompanyController.update)
router.get('/delete', isAuthenticateWithToken, CompanyController.delete)

module.exports = router;
