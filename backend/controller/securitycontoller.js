const { default: mongoose, trusted } = require("mongoose")
const Security = require("../model/Security")
let removeFile = require('../helpers/removeFile')
let fs = require('fs').promises
let securitycontroller = {
    index:async(req,res)=>{
         const title = req.query.title || ""; 
              const query = title
    ? { title: { $regex: new RegExp(title, "i") } } // ✅ Safe regex
    : {};
        let limit = 6
        let page = req.query.page || 1
       
        let security = await Security.find(query).skip((page-1)*limit).limit(limit).sort({createdAt:-1})
         let totalsecurity = await Security.countDocuments()
         let totalPages = totalsecurity/limit
        let links = {
    nextPage:page<totalPages,
    PrevPage:page > 1,
    currentPage:page,
    Loopablelinks:[]
}

for (let index = 0; index < totalPages; index++) {
    let number = index + 1
     links.Loopablelinks.push({ number });
    
}


 let response = {
    data : security,
    links
 }
    return res.json(response)

    },
    store:async(req,res)=>{
       try {
         let {title,description,about} = req.body
        let security = await Security.create({
            title,
            description,
            about
        })
        return res.json(security)
       } catch (e) {
        return res.status.json({msg:"server error"})
       }
    },
    show:async(req,res)=>{
       try {
         let id = req.params.id
         if(!mongoose.Types.ObjectId.isValid(id)){
             return res.status(400).json({msg:"invalid ID"})
         }
        let security = await Security.findById(id)
         if(!security){
              return res.status(400).json({msg:"not found Security"})
         }
        return res.json(security)
       } catch (error) {
        return res.status(500).json({msg:"server error"})
       }
    },
    destory:async(req,res)=>{
        try {
         let id = req.params.id
         if(!mongoose.Types.ObjectId.isValid(id)){
             return res.status(400).json({msg:"invalid ID"})
         }
        let security = await Security.findByIdAndDelete(id)
          await  removeFile(__dirname + '/../public' + security.photo)
         if(!security){
              return res.status(400).json({msg:"not found Security"})
         }
        return res.json(security)
       } catch (error) {
        return res.status(500).json({msg:"server error"})
       }
    },
    update:async(req,res)=>{
       try {
         let id = req.params.id
         if(!mongoose.Types.ObjectId.isValid(id)){
             return res.status(400).json({msg:"invalid ID"})
         }
        let security = await Security.findByIdAndUpdate(id,{
            ...req.body
        })
    await  removeFile(__dirname + '/../public' + security.photo)

         if(!security){
              return res.status(400).json({msg:"not found Security"})
         }
        return res.json(security)
       } catch (error) {
        return res.status(500).json({msg:"server error"})
       }
       
    },
    upload: async(req,res) => {
            try {
                  let id = req.params.id
               
                           if (!mongoose.Types.ObjectId.isValid(id)) {
                               return res.status(400).json({ msg: "Invalid Id" })
                           }
               
                           let security = await Security.findByIdAndUpdate(id, {
                            photo : '/' + req.file.filename
                           })
               
                           if (!security) {
                               return res.status(404).json({ msg: "security data not Found" })     
                           }
               
               
                           return res.json(security)
            } catch (e) {
                 return res.status(500).json({msg:"server error"})
            }
       }

}


module.exports = securitycontroller