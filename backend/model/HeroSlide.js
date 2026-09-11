let mongoose = require('mongoose')
let Schema = mongoose.Schema

let HeroSlideSchema = new Schema(
  {
    photo: {
      type: String,
    },
    order: {
      type: Number,
      default: 0,
    },
    /** How long this slide stays on the home hero (seconds). */
    durationSeconds: {
      type: Number,
      default: 7,
      min: 5,
      max: 10,
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

module.exports = mongoose.model('HeroSlide', HeroSlideSchema)
