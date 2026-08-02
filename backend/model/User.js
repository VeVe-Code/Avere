let mongoose = require("mongoose")
let bcrypt = require('bcrypt')
let Schema = mongoose.Schema

let UserSchema = new Schema({

        name:{
            type:String,
            required : true
    },
         email:{
            type:String,
            required : true,
            unique: true
        },
        phone: {
            type: String,
            default: ''
        },
        password:{
            type:String,
            require:true
        },
        role: {
            type: String,
            enum: ['owner', 'admin', 'customer'],
            default: 'customer'
        },
        isVerified: {
            type: Boolean,
            default: false
        },
        lineId: {
            type: String,
            default: null,
            sparse: true,
            unique: true,
        },
        googleId: {
            type: String,
            default: null,
            sparse: true,
            unique: true,
        },
        otp: {
            type: String,
            default: null
        },
        otpExpires: {
            type: Date,
            default: null
        },
        // legacy (knowledge only) — migrated into savedItems when used
        savedKnowledge: [{
            type: Schema.Types.ObjectId,
            ref: 'Knowledge'
        }],
        savedItems: [{
            type: {
                type: String,
                enum: ['knowledge', 'service', 'system', 'network', 'security', 'events'],
                required: true
            },
            itemId: {
                type: Schema.Types.ObjectId,
                required: true
            }
        }]

})

function makeOtp() {
  return String(Math.floor(100000 + Math.random() * 900000))
}

UserSchema.methods.setOtp = function () {
  this.otp = makeOtp()
  this.otpExpires = new Date(Date.now() + 10 * 60 * 1000)
  return this.otp
}

UserSchema.statics.findOrCreateFromLine = async function ({ lineId, name, email }) {
  let user = await this.findOne({ lineId })
  if (user) {
    // Keep profile name the user already set — do not overwrite from OAuth
    return user
  }

  if (email) {
    user = await this.findOne({ email: String(email).toLowerCase() })
    if (user) {
      user.lineId = lineId
      user.isVerified = true
      if (name && !user.name) user.name = name
      await user.save()
      return user
    }
  }

  let safeEmail = email
    ? String(email).toLowerCase()
    : `line_${lineId}@line.local`

  let existingEmail = await this.findOne({ email: safeEmail })
  if (existingEmail && !existingEmail.lineId) {
    existingEmail.lineId = lineId
    existingEmail.isVerified = true
    await existingEmail.save()
    return existingEmail
  }

  let salt = await bcrypt.genSalt()
  let randomPass = cryptoRandom()
  let hashvalue = await bcrypt.hash(randomPass, salt)

  return this.create({
    name: name || 'LINE User',
    email: safeEmail,
    phone: '',
    password: hashvalue,
    role: 'customer',
    isVerified: true,
    lineId,
  })
}

UserSchema.statics.findOrCreateFromGoogle = async function ({ googleId, name, email }) {
  let user = await this.findOne({ googleId })
  if (user) {
    // Keep profile name the user already set — do not overwrite from OAuth
    return user
  }

  let safeEmail = email ? String(email).toLowerCase() : `google_${googleId}@google.local`

  user = await this.findOne({ email: safeEmail })
  if (user) {
    user.googleId = googleId
    user.isVerified = true
    if (name && !user.name) user.name = name
    await user.save()
    return user
  }

  let salt = await bcrypt.genSalt()
  let hashvalue = await bcrypt.hash(cryptoRandom(), salt)

  return this.create({
    name: name || 'Google User',
    email: safeEmail,
    phone: '',
    password: hashvalue,
    role: 'customer',
    isVerified: true,
    googleId,
  })
}

function cryptoRandom() {
  return require('crypto').randomBytes(24).toString('hex')
}

UserSchema.statics.register = async function(name, email, password, role = 'customer', phone = ''){
      let UserExist = await this.findOne({email})
    if(UserExist){
        throw new Error('user already exists')
    }
    let salt = await bcrypt.genSalt()

    let hashvalue = await bcrypt.hash(password,salt)

    let allowedRoles = ['owner', 'admin', 'customer']
    let safeRole = allowedRoles.includes(role) ? role : 'customer'
    // Staff seed accounts are trusted; customers must verify email
    let isVerified = safeRole === 'owner' || safeRole === 'admin'

    let user = await this.create({
        name,
        email,
        phone: phone || '',
        password: hashvalue,
        role: safeRole,
        isVerified,
    })
    return user
}


UserSchema.statics.login = async function( email, password){
      let user = await this.findOne({email})
    if(!user){
        throw new Error('user does not exist')
    }
    //compare password
  let iscorrect =  await  bcrypt.compare(password, user.password)
   if(iscorrect){
     if (!user.isVerified) {
       let err = new Error('Email not verified')
       err.code = 'EMAIL_NOT_VERIFIED'
       throw err
     }
     return user
   }else{
      throw new Error('Password incorrect')
   }
   
}

module.exports = mongoose.model("User", UserSchema)
