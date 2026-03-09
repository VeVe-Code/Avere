let express = require("express")
const networkcontroller = require("../controller/networkcontroller")
const handleerrormsg = require("../middleware/handleerrormsg")
const { body, validationResult } = require('express-validator');
let upload = require('../helpers/upload')
let router = express.Router()

router.get('/api/network',networkcontroller.index)
router.post('/api/network',[
    body('title').notEmpty(),
    body('description').notEmpty(),
    body('about').notEmpty()        
],handleerrormsg,networkcontroller.store)
router.get('/api/network/:id',networkcontroller.show)
router.post('/api/network/:id/upload',[
    upload.single('photo'),
  body('photo').custom((value,{req})=>{
    if(!req.file){
      throw new Error("photo is required")
    }
    if(!req.file.mimetype.startsWith('image')){
      throw new Error("photo must be image")
    }

    return true   // ✅ ADD THIS LINE ONLY
  }),
],handleerrormsg,networkcontroller.upload)
router.patch('/api/network/:id',networkcontroller.update)
router.delete('/api/network/:id',networkcontroller.destroy)



module.exports = router

