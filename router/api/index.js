const express = require('express')
const _= express.Router()
const shortController=require('../../controller/shortController')

_.use('/short',shortController)

module.exports=_