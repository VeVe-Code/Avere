let express = require('express');
const serviceController = require('../controller/servicecontroller');
const { body, validationResult } = require('express-validator');
const handleerrormsg = require('../middleware/handleerrormsg');
let AuthMiddleware = require('../middleware/AuthMiddleware')
let router = express.Router()
let upload = require('../helpers/upload')



router.get("",serviceController.index);
router.post("",[
    body('name').notEmpty(),
    body('description').notEmpty(),
    body('about').notEmpty()        
],handleerrormsg,
 serviceController.create);
router.get("/:id", serviceController.show);
router.post("/:id/upload", [upload.single('photo'),
    body('photo').custom((value,{req})=>{
        if(!req.file){
            throw new Error('photo is requried')
        }
         if(!req.file.mimetype.startsWith('image')){
            throw new Error('photo must be image')
        }
        return true
    })
],handleerrormsg, serviceController.upload);
router.patch("/:id", serviceController.update);
router.delete("/:id", serviceController.destory);   



module.exports = router;