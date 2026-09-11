let express = require('express');
const serviceController = require('../controller/servicecontroller');
const { body } = require('express-validator');
const handleerrormsg = require('../middleware/handleerrormsg');
let { AuthMiddleware, requireAdmin } = require('../middleware/AuthMiddleware')
let router = express.Router()
let upload = require('../helpers/upload')
const adminOnly = [AuthMiddleware, requireAdmin]


router.get("", ...adminOnly, serviceController.index);
router.post("/reorder", ...adminOnly, serviceController.reorder);
router.post("/normalize-orders", ...adminOnly, serviceController.normalizeOrders);
router.post("/move", ...adminOnly, serviceController.move);
router.post("/switch", ...adminOnly, serviceController.switch);
router.post("", ...adminOnly, [
    body('name').notEmpty(),
    body('description').notEmpty(),
    body('about').notEmpty()        
],handleerrormsg,
 serviceController.create);
router.get("/:id", ...adminOnly, serviceController.show);
router.post("/:id/upload", ...adminOnly, [upload.single('photo'),
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
router.patch("/:id", ...adminOnly, serviceController.update);
router.patch("/:id/hidden", ...adminOnly, serviceController.toggleHidden);
router.patch("/:id/pinned", ...adminOnly, serviceController.togglePinned);
router.delete("/:id", ...adminOnly, serviceController.destory);   



module.exports = router;
