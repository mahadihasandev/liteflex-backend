const mongoose = require('mongoose')

const { Schema } = mongoose;

const shortSchema=new Schema({
    id:Number,
    name:String,
    videoUrl:String,
    tags: { type: [String], default: [] },
    thumbnail: String,
    
})

module.exports=mongoose.model("shorts", shortSchema)