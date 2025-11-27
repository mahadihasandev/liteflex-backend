const mongoose = require('mongoose')

const { Schema } = mongoose;

// Minimal document describing a single LiteFlex "short".
const shortSchema=new Schema({
    id:Number, // legacy numeric id; Mongo's _id is still primary key
    name:String,
    videoUrl:String,
    tags: { type: [String], default: [] }, // allow quick filtering in UI
    thumbnail: String,
    
})

module.exports=mongoose.model("shorts", shortSchema)