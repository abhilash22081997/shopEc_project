const mongoose = require('mongoose')

const bannerSchema = new mongoose.Schema({
    subHead:String,
    mainHead:String,
    imagePath:String
})

module.exports = mongoose.model('banners',bannerSchema)