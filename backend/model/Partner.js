let mongoose = require('mongoose')
let Schema = mongoose.Schema

let PartnerSchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      default: '',
    },
    photo: {
      type: String,
    },
    order: {
      type: Number,
      default: 0,
    },
    hidden: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
)

module.exports = mongoose.model('Partner', PartnerSchema)
