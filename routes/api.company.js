const express = require('express')
const router = express.Router()
const CompanyController = require('../controllers/company')
const isAuthenticateWithToken = require('../utils/isAuthenticateWithToken')


router.post('/', isAuthenticateWithToken, CompanyController.create)

module.exports = router;
