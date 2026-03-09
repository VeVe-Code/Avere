let mongoose = require('mongoose')

let Schema = mongoose.Schema

let CategorySchema = new Schema({

    title:{
        type : String,
        required: true
    }

})


module.exports = mongoose.model('Category',CategorySchema)