let express = require("express")
const securitycontroller = require("../controller/securitycontoller")
const { body, validationResult } = require('express-validator');
const handleerrormsg = require("../middleware/handleerrormsg");
let router = express.Router()
let upload = require('../helpers/upload')


router.get('/api/security',securitycontroller.index)
router.post('/api/security',[
    body('title').notEmpty(),
    body('description').notEmpty(),
    body('about').notEmpty()        
],handleerrormsg,securitycontroller.store)
router.get('/api/security/:id',securitycontroller.show)
router.post('/api/security/:id/upload',[upload.single('photo'),
     body('photo').custom((value,{req}) => {
        if(!req.file){
            throw new Error('photo is required')
        }
         if(!req.file.mimetype.startsWith('image')){
            throw new Error('photo must be image')
        }
        return true
     })
],handleerrormsg, securitycontroller.upload)
router.delete('/api/security/:id',securitycontroller.destory)
router.patch('/api/security/:id',securitycontroller.update)



module.exports=router