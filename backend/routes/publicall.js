let express = require('express')
let router = express.Router()
let Systems = require('../model/Systems')
let Security = require('../model/Security')
let Network = require('../model/Network')
let Services = require('../model/Services')

router.get('/api/publicall', async (req, res) => {
  try {
    let category = req.query.category || null
    let limit = parseInt(req.query.limit) || 6
    let filter = { hidden: { $ne: true } }
    if (category) {
      filter.category = category
    }

    let [systems, security, network, services] = await Promise.all([
      Systems.find(filter).populate('category', 'title').sort({ createdAt: -1 }).limit(limit),
      Security.find(filter).populate('category', 'title').sort({ createdAt: -1 }).limit(limit),
      Network.find(filter).populate('category', 'title').sort({ createdAt: -1 }).limit(limit),
      Services.find(filter).populate('category', 'title').sort({ createdAt: -1 }).limit(limit)
    ])

    return res.json({ systems, security, network, services })
  } catch (e) {
    return res.status(500).json({ msg: 'server error' })
  }
})

module.exports = router
