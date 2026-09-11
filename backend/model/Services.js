let mongoose = require('mongoose')
let Schema = mongoose.Schema

let serviceSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  photo: {
    type: String
  },
  about: {
    type: String,
    required: true
  },
  category: {
    type: Schema.Types.ObjectId,   // 🔗 Category ID
    ref: 'Category',               // 🔗 Category model
    required: true
  },
  hidden: {
    type: Boolean,
    default: false
  },
  pinned: {
    type: Boolean,
    default: false
  },
  order: {
    type: Number,
    default: 0
  },
  displayDate: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
})

module.exports = mongoose.model('Service', serviceSchema)
