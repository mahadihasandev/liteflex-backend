const express = require('express')
const _= express.Router()
const sortController=require('../controller/shortController')

// All controller routes are namespaced under /api to keep the public surface predictable.
_.use('/api',sortController)

module.exports=_