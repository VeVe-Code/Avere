let mongoose = require('mongoose')
let Schema = mongoose.Schema
let systemSchema = new Schema({
    title:{
        type:String,
        required:true
    },
    description:{
         type:String,
         required:true
    },
    about:{
        type:String,
        required:true
    },
    photo:{
        type: String,
       
    }, category:{
        type: Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    hidden: {
        type: Boolean,
        default: false
    }

},{
    timestamps:true
})

module.exports = mongoose.model('Systems',systemSchema)
