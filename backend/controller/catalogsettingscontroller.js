const CatalogSettings = require('../model/CatalogSettings')
const { CATALOG_KEYS } = require('../model/CatalogSettings')
const { setCatalogSortMode, getCatalogSettings } = require('../helpers/catalogSort')

function isValidKey(key) {
  return CATALOG_KEYS.includes(key)
}

const catalogsettingscontroller = {
  show: async (req, res) => {
    try {
      const key = req.params.key
      if (!isValidKey(key)) {
        return res.status(400).json({ msg: 'Invalid catalog key' })
      }
      const doc = await getCatalogSettings(key)
      return res.json({ key: doc.key, sortMode: doc.sortMode })
    } catch (e) {
      console.error('catalog settings show:', e)
      return res.status(500).json({ msg: 'Server error' })
    }
  },

  update: async (req, res) => {
    try {
      const key = req.params.key
      if (!isValidKey(key)) {
        return res.status(400).json({ msg: 'Invalid catalog key' })
      }
      const sortMode = req.body?.sortMode
      if (sortMode !== 'manual' && sortMode !== 'date') {
        return res.status(400).json({ msg: 'sortMode must be manual or date' })
      }
      const doc = await setCatalogSortMode(key, sortMode)
      return res.json({ key: doc.key, sortMode: doc.sortMode })
    } catch (e) {
      console.error('catalog settings update:', e)
      return res.status(500).json({ msg: 'Server error' })
    }
  },
}

module.exports = catalogsettingscontroller
