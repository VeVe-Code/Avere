const { default: mongoose } = require("mongoose")
const Contactus = require("../model/Contactus")


let contactuscontroller = {

    index:async (req,res)=>{
        let contactus = await Contactus.find().sort({createAt:-1})
        return res.json(contactus)
    },
    store:async(req,res) =>{
        try {
            let {name, email, phno, msg} = req.body
        let contactus = await Contactus.create({
            name, email, phno, msg
        })
        return res.json(contactus)
        } catch (e) {
              return res.status(400).json({msg : "server error"})
        }
    },
    show:async (req, res) =>{
      try {
          let id = req.params.id
          if(!mongoose.Types.ObjectId.isValid(id)){
              return res.status(400).json({msg : "Invalid ID"})
          }
        let contactus = await Contactus.findById(id)
        if(!contactus){
             return res.status(404).json({msg : "not found data"})
        }

        return res.json(contactus)
      } catch (e) {
        return res.status(400).json({msg : "server error"})
      }
    },
    destory:async (req, res) =>{
          try {
          let id = req.params.id
          if(!mongoose.Types.ObjectId.isValid(id)){
              return res.status(400).json({msg : "Invalid ID"})
          }
        let contactus = await Contactus.findByIdAndDelete(id)
        if(!contactus){
             return res.status(404).json({msg : "not found data"})
        }

        return res.json(contactus)
      } catch (e) {
        return res.status(400).json({msg : "server error"})
      }
    
    }

}

module.exports = contactuscontroller