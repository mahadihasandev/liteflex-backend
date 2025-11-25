const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const app = express()
const router = require('./router')
const path = require('path')
const port = 8000

app.use(cors())
app.use(express.json())
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))
mongoose.connect('mongodb+srv://mayhaydihasancom_db_user:2vfsL5d0ZbgPoiaI@cluster0.fkxqljn.mongodb.net/liteFlex?appName=Cluster0')
  .then(() => console.log("Connected"))
app.use(router)

app.listen(port, () => console.log(`Server listening on port ${port}`))