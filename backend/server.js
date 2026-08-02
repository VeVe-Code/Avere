let express = require("express")
require('dotenv').config()
let app = express()
let PositionRoute = require('./routes/position.js')
let serviceRoute = require('./routes/service');
let knowLedgeRoute = require('./routes/knowledge')
let SecurityRoute = require('./routes/security')
let SystemsRoute =require('./routes/systems')
let UserRoute =require('./routes/user.js')
let PublicknowLedgeRoute =require('./routes/publicknowledge.js')
let PublicNetworkRoute = require('./routes/publicnetwork.js')
let PublicSecurityRoute = require('./routes/publicsecurity.js')
let PublicSystemsRoute = require('./routes/publicsystems.js')
let CategoryRoute = require('./routes/category.js')
let PublicServiceRoute =  require('./routes/publicservice.js')
let PublicCategoryRoute = require('./routes/publiccategory.js')
let ContactusRoute = require ('./routes/contactus.js')
let PublicAllRoute = require('./routes/publicall.js')
let PublicSearchRoute = require('./routes/publicsearch.js')
const EventsRoute = require("./routes/events");
let PublicPositionRoute = require('./routes/publicposition.js')
let PubliceventsRoute = require('./routes/publicevents.js')
let cookieParser = require('cookie-parser')
let morgan = require('morgan')
let cors = require('cors')

let mongoose = require('mongoose')
let NetworkRoute = require("./routes/network");
let path = require('path')
let fs = require('fs')

let mongoURL = "mongodb+srv://Avere:Avere1111@cluster0.pmp9r2g.mongodb.net/?appName=Cluster0"
app.listen(process.env.PORT, () => {
    console.log("Server is running on port " + process.env.PORT)
    
    // SSL options များကို ထည့်သွင်းပေးပါ
    mongoose.connect(mongoURL, {
        tls: true,
        tlsAllowInvalidCertificates: true
    })
    .then(async () => {
        console.log("Connected to MongoDB")
        let User = require('./model/User')

        // old users without role → admin
        let result = await User.updateMany(
            { $or: [{ role: { $exists: false } }, { role: null }] },
            { $set: { role: 'admin' } }
        )
        if (result.modifiedCount) {
            console.log("Migrated " + result.modifiedCount + " user(s) to admin role")
        }

        // existing accounts created before email OTP → treat as verified
        let verifiedMigrate = await User.updateMany(
            { isVerified: { $exists: false } },
            { $set: { isVerified: true } }
        )
        if (verifiedMigrate.modifiedCount) {
            console.log("Migrated " + verifiedMigrate.modifiedCount + " user(s) as email-verified")
        }

        // ensure at least one owner
        let ownerCount = await User.countDocuments({ role: 'owner' })
        let count = await User.countDocuments()
        if (count === 0) {
            await User.register('Owner', 'owner@avere.example.com', 'owner123', 'owner')
            console.log("Seed owner ready → email: owner@avere.example.com  password: owner123")
        } else if (ownerCount === 0) {
            let firstStaff = await User.findOne({ role: 'admin' }).sort({ _id: 1 })
            if (!firstStaff) {
                firstStaff = await User.findOne().sort({ _id: 1 })
            }
            if (firstStaff) {
                firstStaff.role = 'owner'
                await firstStaff.save()
                console.log("Promoted to owner → " + firstStaff.email)
            }
        }

        // move old root images → public/images (host-ready)
        let publicDir = path.join(__dirname, 'public')
        let imagesDir = path.join(publicDir, 'images')
        fs.mkdirSync(imagesDir, { recursive: true })
        let files = fs.readdirSync(publicDir)
        let moved = 0
        for (let file of files) {
            let full = path.join(publicDir, file)
            if (!fs.statSync(full).isFile()) continue
            if (!/\.(jpg|jpeg|png|gif|webp)$/i.test(file)) continue
            let dest = path.join(imagesDir, file)
            if (!fs.existsSync(dest)) {
                fs.renameSync(full, dest)
                moved++
            }
        }
        if (moved) {
            console.log("Moved " + moved + " image(s) to public/images")
        }
    })
    .catch((err) => {
        console.log("MongoDB Connection Failed: ", err)
    })
})


app.use('/images', express.static(path.join(__dirname, 'public/images')))
app.use(express.static('public'))
app.use(cors({
        origin : process.env.FRONTEND_URL || "http://localhost:5173",
        credentials : true
}))
app.use(cookieParser())
app.use(express.json({ limit: "50mb" }))
app.use(express.urlencoded({ limit: "50mb", extended: true }))
app.use(morgan('dev'))
app.get("/",(req,res)=>{
    return res.json({message:"Hello from server"})
})
app.use("/api/service",serviceRoute)
app.use(knowLedgeRoute)
app.use(PublicknowLedgeRoute)
app.use(SecurityRoute)
app.use(PublicSecurityRoute)
app.use(NetworkRoute)
app.use(PublicNetworkRoute)
app.use(SystemsRoute)
app.use(PublicSystemsRoute)
app.use(PublicAllRoute)
app.use(PublicSearchRoute)
app.use(PublicServiceRoute)
app.use(CategoryRoute)
app.use(PublicCategoryRoute)
app.use(ContactusRoute)
app.use("/api/events", EventsRoute);
app.use("/api/publicevents", PubliceventsRoute)
app.use(PositionRoute)
app.use('/api/users', UserRoute)
app.use('/api/publicposition', PublicPositionRoute)

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

// multer / upload errors
app.use((err, req, res, next) => {
    if (err && err.message) {
        if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({ error: 'Image must be under 5MB' })
        }
        if (err.message.includes('image') || err.message.includes('Only image')) {
            return res.status(400).json({ error: err.message })
        }
    }
    next(err)
})
