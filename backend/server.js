let express = require("express")
let app = express()
let serviceRoute = require('./routes/service');
let knowLedgeRoute = require('./routes/knowledge')
let SecurityRoute = require('./routes/security')
let SystemsRoute =require('./routes/systems')
let UserRoute =require('./routes/user.js')
let PublicknowLedgeRoute =require('./routes/publicknowledge.js')
let PublicNetworkRoute = require('./routes/publicnetwork.js')
let AuthMiddleware = require('./middleware/AuthMiddleware.js')
let PublicSecurityRoute = require('./routes/publicsecurity.js')
let PublicSystemsRoute = require('./routes/publicsystems.js')
let CategoryRoute = require('./routes/category.js')
let PublicServiceRoute =  require('./routes/publicservice.js')
let PublicCategoryRoute = require('./routes/publiccategory.js')
let ContactusRoute = require ('./routes/contactus.js')
let cookieParser = require('cookie-parser')
require('dotenv').config()
let morgan = require('morgan')
let cors = require('cors')

let mongoose = require('mongoose')
let NetworkRoute = require("./routes/network");

let mongoURL = "mongodb+srv://kzt2288330022_db_user:test123@cluster0.90p0udi.mongodb.net/?appName=Cluster0"
app.listen(process.env.PORT,(()=>{
    console.log("Server is running on port " + process.env.PORT)
    mongoose.connect(mongoURL).then(()=>{
    console.log("Connected to MongoDB") 
})

}
)
)
app.use(express.static('public'))
app.use(cors({
    
        origin : "http://localhost:5173",
        credentials : true
    
}))
app.use(cookieParser())
app.use(express.json())

app.use(morgan('dev'))
app.get("/",(req,res)=>{
    return res.json({message:"Hello from server"})
})
app.use("/api/service",AuthMiddleware,serviceRoute)
app.use(knowLedgeRoute)
app.use(PublicknowLedgeRoute)
app.use(SecurityRoute)
app.use(PublicSecurityRoute)
app.use(NetworkRoute)
app.use(PublicNetworkRoute)
app.use(SystemsRoute)
app.use(PublicSystemsRoute)
app.use(PublicServiceRoute)
app.use(CategoryRoute)
app.use(PublicCategoryRoute)
app.use(ContactusRoute)



app.use('/api/users', UserRoute)


app.get('/set-cookie',(req,res) =>{
    // res.setHeader('Set-cookie',"name=hlainginthan")
    res.cookie("name","Aung Aung")
   return res.send('cookie already set')
})


app.get('/get-cookie',(req,res) =>{
    // res.setHeader('Set-cookie',"name=hlainginthan")
    let cookie = req.cookies
   
   return res.json(cookie)
})