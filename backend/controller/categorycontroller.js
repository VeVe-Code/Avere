const { default: mongoose } = require("mongoose")
const Category = require("../model/Category")

let categorycontroller = {
    index:async(req,res) =>{
        let categories = await Category.find().sort({createdAt:-1})
        
        return res.json(categories)
    },
    store:async(req,res) =>{
        try {
            let {title} = req.body
        let category = await Category.create({
            title
        })
        return res.json(category)
        } catch (e) {
            return res.status(500).json({msg:"server error"})
        }
    },
    show:async(req,res) =>{
     try {
         let id = req.params.id
          if(!mongoose.Types.ObjectId.isValid(id)){
                     return res.status(400).json({msg: "Invalid Category ID"})
                 }
    let category = await Category.findById(id)
    if(!category){
            return res.status(404).json({msg: "not found Category"})
    }
        return res.json(category)
     } catch (e) {
        return res.status(500).json({msg:"server error"}) 
     }
    },
   update: async (req, res) => {
  try {
    let id = req.params.id

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ msg: "Invalid Category ID" })
    }

    const category = await Category.findByIdAndUpdate(
      id,
      { ...req.body },
      {
        new: true,        // ✅ return updated document
        runValidators: true
      }
    )

    if (!category) {
      return res.status(404).json({ msg: "Category not found" })
    }

    return res.status(200).json(category)
  } catch (e) {
    return res.status(500).json({ msg: "Server error" })
  }
}
,
      destory:async(req,res) =>{
       try {
         let id = req.params.id
          if(!mongoose.Types.ObjectId.isValid(id)){
                     return res.status(400).json({msg: "Invalid Category ID"})
                 }
    let category = await Category.findByIdAndDelete(id)
    if(!category){
            return res.status(404).json({msg: "not found Category"})
    }
        return res.json(category)
     } catch (e) {
        return res.status(500).json({msg:"server error"}) 
     }
    }
}

module.exports = categorycontroller