let express = require("express")
const networkcontroller = require("../controller/networkcontroller")
const handleerrormsg = require("../middleware/handleerrormsg")
const { body } = require('express-validator');
let upload = require('../helpers/upload')
let router = express.Router()
const { AuthMiddleware, requireAdmin } = require('../middleware/AuthMiddleware');
const adminOnly = [AuthMiddleware, requireAdmin];

router.get('/api/network', ...adminOnly, networkcontroller.index)
router.post('/api/network', ...adminOnly, [
    body('title').notEmpty(),
    body('description').notEmpty(),
    body('about').notEmpty()        
],handleerrormsg,networkcontroller.store)
router.get('/api/network/:id', ...adminOnly, networkcontroller.show)
router.post('/api/network/:id/upload', ...adminOnly, [
    upload.single('photo'),
  body('photo').custom((value,{req})=>{
    if(!req.file){
      throw new Error("photo is required")
    }
    if(!req.file.mimetype.startsWith('image')){
      throw new Error("photo must be image")
    }

    return true
  }),
],handleerrormsg,networkcontroller.upload)
router.patch('/api/network/:id', ...adminOnly, networkcontroller.update)
router.patch('/api/network/:id/hidden', ...adminOnly, networkcontroller.toggleHidden)
router.delete('/api/network/:id', ...adminOnly, networkcontroller.destroy)



module.exports = router
