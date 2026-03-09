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
        password:{
            type:String,
            require:true
        }

})

UserSchema.statics.register = async function(name, email, password){
      let UserExist = await this.findOne({email})
    if(UserExist){
        throw new Error('user already exists')
    }
    let salt = await bcrypt.genSalt()

    let hashvalue = await bcrypt.hash(password,salt)

    let user = await this.create({
        name,
        email,
        password: hashvalue
    })
    return user
}


UserSchema.statics.login = async function( email, password){
      let user = await this.findOne({email})
    if(!user){
        throw new Error('user does not exist')
    }
    //compare password
  let iscorrect =  await  bcrypt.compare(password,user.password)
   if(iscorrect){
     return user
   }else{
      throw new Error('Password incorrect')
   }
   
}

module.exports = mongoose.model("User", UserSchema)