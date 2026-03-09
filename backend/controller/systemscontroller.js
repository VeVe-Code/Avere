const { default: mongoose } = require("mongoose")
const Systems = require("../model/Systems")
let removeFile = require('../helpers/removeFile')


let systemscontroller = {
    
    index:async(req,res)=>{
         const title = req.query.title || ""; 
              const query = title
    ? { title: { $regex: new RegExp(title, "i") } } // ✅ Safe regex
    : {};
        let limit = 6
        let page = req.query.page  
        let systems = await Systems.find(query).skip((page-1) * limit).limit(limit).sort({createdAt:-1})
        let totalsystems = await Systems.countDocuments()
        let totalPage = Math.ceil(totalsystems/limit)
        
        let links = {
        nextPage : true,
        PrevPage : false,
        currentPage : page,
        loopsablelinks:[]
    }

    for (let index = 0; index < totalPage; index++) {
        let number = index + 1
        links.loopsablelinks.push({number})
        
    }

    let response = {
         data : systems,
        links
    }
       
     
        return res.json(response)
    },
    store:async(req,res)=>{
      try{  let {title,description,about} = req.body
        let system = await Systems.create({
            title,
            description,
            about
        })
        return res.json(system)}
        catch(e){
             return res.status(500).json({msg:"server error"})
        }
    },
    show:async(req,res) => {
       try {
         let id = req.params.id
         if(!mongoose.Types.ObjectId.isValid(id)){
             return res.status(400).json({msg:"Invalid Id"})
         }
        let  system = await Systems.findById(id)
        if(!system){
              return res.status(404).json({msg:"system not Found"})
        }
        return res.json(system)
       } catch (e) {
           return res.status(500).json({msg:"server error"})
       }
    },
     destroy: async (req, res) => {
        try {
            let id = req.params.id

            if (!mongoose.Types.ObjectId.isValid(id)) {
                return res.status(400).json({ msg: "Invalid Id" })
            }

            let system = await Systems.findByIdAndDelete(id)

            if (!system) {
                return res.status(404).json({ msg: "system not Found" })
            }

            await removeFile(__dirname + '/../public' + system.photo)

            return res.json(system)
        } catch (e) {
            console.log(e)
            return res.status(500).json({ msg: "server error" })
        }
    },
  
    update: async (req, res) => {
        try {
            let id = req.params.id

            if (!mongoose.Types.ObjectId.isValid(id)) {
                return res.status(400).json({ msg: "Invalid Id" })
            }

            let system = await Systems.findByIdAndUpdate(id, {
                ...req.body
            })

            if (!system) {
                return res.status(404).json({ msg: "system not Found" })     
            }

            await removeFile(__dirname + '/../public' + system.photo)

            return res.json(system)
        } catch (e) {
            console.log(e)
            return res.status(500).json({ msg: "server error" })
        }
    },
    upload: async (req, res) => {
     try {
       let id = req.params.id
   
       if (!mongoose.Types.ObjectId.isValid(id)) {
         return res.status(400).json({ msg: "Invalid  ID" })
       }
   
       // ✅ check file
       if (!req.file) {
         return res.status(400).json({ msg: "No file uploaded" })
       }
   
       const imagePath = "/" + req.file.filename
   
       let system = await Systems.findByIdAndUpdate(
         id,
         { photo: imagePath },
         { new: true }   // ✅ return updated doc
       )
   
       if (!system) {
         return res.status(404).json({ msg: "System not found" })
       }
   
       return res.json(system)
   
     } catch (e) {
       console.log(e)
       return res.status(500).json({ msg: "server error" })
     }
   }
}
module.exports = systemscontroller