const mongoose = require('mongoose')

const CATALOG_KEYS = [
  'services',
  'network',
  'systems',
  'security',
  'events',
  'knowledge',
  'news',
]

const CatalogSettingsSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true,
      enum: CATALOG_KEYS,
    },
    sortMode: {
      type: String,
      enum: ['manual', 'date'],
      default: 'manual',
    },
  },
  { timestamps: true }
)

module.exports = mongoose.model('CatalogSettings', CatalogSettingsSchema)
module.exports.CATALOG_KEYS = CATALOG_KEYS
