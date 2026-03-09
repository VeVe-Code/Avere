let express = require("express")
let systemscontroller = require('../controller/systemscontroller')
const handleerrormsg = require("../middleware/handleerrormsg")
const { body, validationResult } = require('express-validator');
let upload = require('../helpers/upload')

let router = express.Router()

router.get('/api/systems', systemscontroller.index)
router.post('/api/systems', [
    body('title').notEmpty(),
    body('description').notEmpty(),
    body('about').notEmpty()        
],handleerrormsg,systemscontroller.store)
router.get('/api/systems/:id', systemscontroller.show)
router.post('/api/systems/:id/upload',[
    upload.single('photo'),
     body('photo').custom((value,{req})=>{
        if(!req.file){
                throw new Error('photo is required')
        } 
        if(!req.file.mimetype.startsWith('image')){
                throw new Error('photo must be image')
        } 
        
            return true
         
     }
    )
    
], handleerrormsg, systemscontroller.upload)
router.delete('/api/systems/:id', systemscontroller.destroy)
router.patch('/api/systems/:id', systemscontroller.update)



module.exports = router