const express = require('express')
const _= express.Router()
const sortController=require('../controller/shortController')


_.use('/api',sortController)

module.exports=_