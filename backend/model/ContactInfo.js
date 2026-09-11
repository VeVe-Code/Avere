let mongoose = require('mongoose')
let Schema = mongoose.Schema

let ContactInfoSchema = new Schema(
  {
    key: {
      type: String,
      default: 'site',
      unique: true,
    },
    companyName: {
      type: String,
      default: 'AVERE CO., LTD.',
    },
    email: {
      type: String,
      default: 'info@avere.example.com',
    },
    phone: {
      type: String,
      default: '+66 21245263',
    },
    address: {
      type: String,
      default:
        '2823/3 Charoen Krung Road, Bang Kho Laem,\nBang Kho Laem, Bangkok 10120',
    },
    note: {
      type: String,
      default: 'We reply within 24 hours.',
    },
  },
  {
    timestamps: true,
  }
)

module.exports = mongoose.model('ContactInfo', ContactInfoSchema)
