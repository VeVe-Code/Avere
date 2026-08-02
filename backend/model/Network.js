let mongoose = require ('mongoose')

let Schema = mongoose.Schema

let networkSchema = new Schema({
    title:{
        type:String,
        required:true
    },
     photo:{
        type:String,
        
    },
    description:{
        type:String,
        required:true
    },
    about:{
        type:String,
        required:true
    },
 category:{
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


module.exports = mongoose.model("Network", networkSchema)
