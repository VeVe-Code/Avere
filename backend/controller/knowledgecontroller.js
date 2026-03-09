const mongoose = require("mongoose");
const Knowledge = require("../model/Knowledge");
let removeFile = require('../helpers/removeFile')

let knowledgecontroller = {
    index:async(req,res)=>{
        const title = req.query.title || ""; 
              const query = title
    ? { title: { $regex: new RegExp(title, "i") } } // ✅ Safe regex
    : {};
       let limit = 6
       let page = req.query.page || 1
        let knowledge = await Knowledge.find(query).skip((page-1)*limit).limit(limit).sort({createdAt:-1});
        let totalKnowledge = await Knowledge.countDocuments();
        let totalPages = Math.ceil(totalKnowledge / limit);
        let Links={
   nextPage: page >= totalPages ? false : true,
   PrevPage:page === 1 ? false : true,
   currentPage:page,
   LoopableLinks:[]
}

for(let index=0; index<totalPages; index++){
    let number = index + 1
   Links.LoopableLinks.push({number})
}   

 let response = {
    data : knowledge,
    Links
 }

        return res.json(response)
    },
    store:async(req,res)=>{
       try{
         let{title,description,about} = req.body;
        let knowledge = await Knowledge.create({
            title,
            description,
            about
        })
        return res.json(knowledge)
       }catch(e){
        return res.status(500).json({msg: "Failed to create knowledge"})
       }
    },
    show:async(req,res)=>{
       try{ let id = req.params.id;
        if(!mongoose.Types.ObjectId.isValid(id)){
            return res.status(400).json({msg: "Invalid knowledge ID"})
        }
        let knowledge = await Knowledge.findById(id)
            if(!knowledge){
                return res.status(404).json({msg: "Knowledge not found"})
            }
        return res.json(knowledge)}
        catch(e){
            return res.status(500).json({msg: "server error"})
        }
    },
    update:async(req,res)=>{
        try{ let id = req.params.id;
        if(!mongoose.Types.ObjectId.isValid(id)){
            return res.status(400).json({msg: "Invalid knowledge ID"})
        }
        let knowledge = await Knowledge.findByIdAndUpdate(id,{
            ...req.body
        })
      await  removeFile(__dirname + '/../public' + knowledge.photo)
            if(!knowledge){
                return res.status(404).json({msg: "Knowledge not found"})
            }
        return res.json(knowledge)}
        catch(e){
            return res.status(500).json({msg: "server error"})
        }
    },
    destroy:async(req,res)=>{
          try{ let id = req.params.id;
        if(!mongoose.Types.ObjectId.isValid(id)){
            return res.status(400).json({msg: "Invalid knowledge ID"})
        }
        let knowledge = await Knowledge.findByIdAndDelete(id)
      await  removeFile(__dirname + '/../public' + knowledge.photo)
            if(!knowledge){
                return res.status(404).json({msg: "Knowledge not found"})
            }
        return res.json(knowledge)}
        catch(e){
            return res.status(500).json({msg: "server error"})
        }
    }
    ,
    upload:async (req,res) => {
     try {
       let id = req.params.id;
        if(!mongoose.Types.ObjectId.isValid(id)){
            return res.status(400).json({msg: "Invalid knowledge ID"})
        }
        let knowledge = await Knowledge.findByIdAndUpdate(id,{
            photo : '/' + req.file.filename
        })
            if(!knowledge){
                return res.status(404).json({msg: "Knowledge not found"})
            }
        return res.json(knowledge)
     } catch (e) {
        return res.status(500).json({msg: "server error"})
     }
    }
}
module.exports = knowledgecontroller