let mongoose = require('mongoose')
const { PRODUCT_CATEGORIES } = require('../helpers/productCategories')

let Schema = mongoose.Schema

let CategorySchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    // Fixed section this product belongs to (UI: "category")
    category: {
      type: String,
      enum: PRODUCT_CATEGORIES,
      required: true,
    },
  },
  {
    timestamps: true,
  }
)

CategorySchema.index({ category: 1, title: 1 })

module.exports = mongoose.model('Category', CategorySchema)
