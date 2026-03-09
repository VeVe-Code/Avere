let mongoose = require('mongoose');
let Schema = mongoose.Schema

let KnowledgeScgema = new Schema({
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
        
    }

},{
    timestamps:true
})
module.exports = mongoose.model("Knowledge",KnowledgeScgema);