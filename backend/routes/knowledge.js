let express = require('express');
let knowledgecontroller = require('../controller/knowledgecontroller');
let Router = express.Router();
const { body, validationResult } = require('express-validator');
const handleerrormsg = require('../middleware/handleerrormsg');
let upload = require('../helpers/upload')

Router.get('/api/knowledge',knowledgecontroller.index);
Router.post('/api/knowledge',[
    body('title').notEmpty(),
    body('description').notEmpty(),
    body('about').notEmpty()        
],handleerrormsg,knowledgecontroller.store);
Router.get('/api/knowledge/:id',knowledgecontroller.show);
Router.post('/api/knowledge/:id/upload',[upload.single('photo'),
  body('photo').custom((value,{req})=>{
    if(!req.file){
      throw new Error("photo is requried")
    }
     if(!req.file.mimetype.startsWith('image')){
      throw new Error("photo must be image")
    }
    return true
  })
],handleerrormsg,knowledgecontroller.upload);
Router.patch('/api/knowledge/:id',knowledgecontroller.update);
Router.delete('/api/knowledge/:id',knowledgecontroller.destroy);    




module.exports = Router;