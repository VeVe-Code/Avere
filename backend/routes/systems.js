let express = require("express")
let systemscontroller = require('../controller/systemscontroller')
const handleerrormsg = require("../middleware/handleerrormsg")
const { body } = require('express-validator');
let upload = require('../helpers/upload')
const { AuthMiddleware, requireAdmin } = require('../middleware/AuthMiddleware');
const adminOnly = [AuthMiddleware, requireAdmin];

let router = express.Router()

router.get('/api/systems', ...adminOnly, systemscontroller.index)
router.post('/api/systems/reorder', ...adminOnly, systemscontroller.reorder)
router.post('/api/systems/normalize-orders', ...adminOnly, systemscontroller.normalizeOrders)
router.post('/api/systems/move', ...adminOnly, systemscontroller.move)
router.post('/api/systems/switch', ...adminOnly, systemscontroller.switch)
router.post('/api/systems', ...adminOnly, [
    body('title').notEmpty(),
    body('description').notEmpty(),
    body('about').notEmpty()        
],handleerrormsg,systemscontroller.store)
router.get('/api/systems/:id', ...adminOnly, systemscontroller.show)
router.post('/api/systems/:id/upload', ...adminOnly, [
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
router.delete('/api/systems/:id', ...adminOnly, systemscontroller.destroy)
router.patch('/api/systems/:id', ...adminOnly, systemscontroller.update)
router.patch('/api/systems/:id/hidden', ...adminOnly, systemscontroller.toggleHidden)
router.patch('/api/systems/:id/pinned', ...adminOnly, systemscontroller.togglePinned)



module.exports = router
