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
    },
    pinned: {
        type: Boolean,
        default: false
    },
    order: {
        type: Number,
        default: 0
    },
    displayDate: {
        type: Date,
        default: Date.now
    }

},{
    timestamps:true
})
module.exports = mongoose.model("Events",EventsSchema);
