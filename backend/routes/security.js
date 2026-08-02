let express = require("express")
const securitycontroller = require("../controller/securitycontoller")
const { body } = require('express-validator');
const handleerrormsg = require("../middleware/handleerrormsg");
let router = express.Router()
let upload = require('../helpers/upload')
const { AuthMiddleware, requireAdmin } = require('../middleware/AuthMiddleware');
const adminOnly = [AuthMiddleware, requireAdmin];


router.get('/api/security', ...adminOnly, securitycontroller.index)
router.post('/api/security', ...adminOnly, [
    body('title').notEmpty(),
    body('description').notEmpty(),
    body('about').notEmpty()        
],handleerrormsg,securitycontroller.store)
router.get('/api/security/:id', ...adminOnly, securitycontroller.show)
router.post('/api/security/:id/upload', ...adminOnly, [upload.single('photo'),
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
router.delete('/api/security/:id', ...adminOnly, securitycontroller.destory)
router.patch('/api/security/:id', ...adminOnly, securitycontroller.update)
router.patch('/api/security/:id/hidden', ...adminOnly, securitycontroller.toggleHidden)



module.exports=router
