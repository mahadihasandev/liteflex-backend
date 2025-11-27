const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const app = express()
const router = require('./router')
const path = require('path')
const port = 8000

// Basic middleware setup so requests arrive as JSON and can cross domains.
app.use(cors())
app.use(express.json())

// Expose uploaded assets (if any) so the frontend can reference them by URL.
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

// Initialize the Mongo connection once on startup; crash logs help diagnose env issues.
mongoose.connect('mongodb+srv://mayhaydihasancom_db_user:2vfsL5d0ZbgPoiaI@cluster0.fkxqljn.mongodb.net/liteFlex?appName=Cluster0')
  .then(() => console.log("Connected"))

// Attach the API routes (see router folder for details).
app.use(router)

app.listen(port, () => console.log(`Server listening on port ${port}`))