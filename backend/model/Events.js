let mongoose = require('mongoose');
let Schema = mongoose.Schema

let EventsSchema = new Schema({
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
    }
    ,
    photo:{
        type:String,
        
    },
    hidden: {
        type: Boolean,
        default: false
    }

},{
    timestamps:true
})
module.exports = mongoose.model("Events",EventsSchema);
