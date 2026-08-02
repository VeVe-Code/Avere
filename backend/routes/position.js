let express = require('express')
const positioncontroller = require('../controller/positioncontroller')
let router = express.Router()
const { body } = require('express-validator');
const handleerrormsg = require('../middleware/handleerrormsg');
const { AuthMiddleware, requireAdmin } = require('../middleware/AuthMiddleware');
const adminOnly = [AuthMiddleware, requireAdmin];

router.get("/api/position", ...adminOnly, positioncontroller.index)
router.post("/api/position", ...adminOnly, [
    body('title').notEmpty(),
    body('description').notEmpty(),
    body('detail').optional(),
], handleerrormsg, positioncontroller.store)
router.get("/api/position/:id", ...adminOnly, positioncontroller.show)
router.put("/api/position/:id", ...adminOnly, positioncontroller.update)
router.patch("/api/position/:id/hidden", ...adminOnly, positioncontroller.toggleHidden)
router.delete("/api/position/:id", ...adminOnly, positioncontroller.destroy)

module.exports = router
