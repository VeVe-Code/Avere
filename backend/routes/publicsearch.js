let express = require('express')
let router = express.Router()
let Systems = require('../model/Systems')
let Security = require('../model/Security')
let Network = require('../model/Network')
let Services = require('../model/Services')
let Knowledge = require('../model/Knowledge')
let News = require('../model/News')
let Events = require('../model/Events')
let Position = require('../model/Position')

const escapeRegex = (value = '') =>
  String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

router.get('/api/publicsearch', async (req, res) => {
  try {
    let q = (req.query.q || '').trim()
    if (!q || q.length < 1) {
      return res.json({ results: [], q: '' })
    }

    let limit = Math.min(parseInt(req.query.limit, 10) || 8, 20)
    let regex = new RegExp(escapeRegex(q), 'i')
    let visible = { hidden: { $ne: true } }

    let descOrTitle = {
      ...visible,
      $or: [{ title: regex }, { description: regex }],
    }
    let serviceOr = {
      ...visible,
      $or: [{ name: regex }, { description: regex }],
    }

    let [services, network, systems, security, knowledge, news, events, positions] =
      await Promise.all([
        Services.find(serviceOr)
          .select('name description photo')
          .sort({ createdAt: -1 })
          .limit(limit),
        Network.find(descOrTitle)
          .select('title description photo')
          .sort({ createdAt: -1 })
          .limit(limit),
        Systems.find(descOrTitle)
          .select('title description photo')
          .sort({ createdAt: -1 })
          .limit(limit),
        Security.find(descOrTitle)
          .select('title description photo')
          .sort({ createdAt: -1 })
          .limit(limit),
        Knowledge.find(descOrTitle)
          .select('title description photo')
          .sort({ createdAt: -1 })
          .limit(limit),
        News.find(descOrTitle)
          .select('title description photo')
          .sort({ createdAt: -1 })
          .limit(limit),
        Events.find(descOrTitle)
          .select('title description photo')
          .sort({ createdAt: -1 })
          .limit(limit),
        Position.find(descOrTitle)
          .select('title description')
          .sort({ createdAt: -1 })
          .limit(limit),
      ])

    let results = [
      ...services.map((d) => ({
        id: d._id,
        type: 'service',
        label: 'Service',
        title: d.name,
        description: d.description,
        photo: d.photo,
        href: `/service/${d._id}`,
      })),
      ...network.map((d) => ({
        id: d._id,
        type: 'network',
        label: 'Network',
        title: d.title,
        description: d.description,
        photo: d.photo,
        href: `/network/${d._id}`,
      })),
      ...systems.map((d) => ({
        id: d._id,
        type: 'system',
        label: 'Systems',
        title: d.title,
        description: d.description,
        photo: d.photo,
        href: `/system/${d._id}`,
      })),
      ...security.map((d) => ({
        id: d._id,
        type: 'security',
        label: 'Security',
        title: d.title,
        description: d.description,
        photo: d.photo,
        href: `/security/${d._id}`,
      })),
      ...knowledge.map((d) => ({
        id: d._id,
        type: 'knowledge',
        label: 'Knowledge',
        title: d.title,
        description: d.description,
        photo: d.photo,
        href: `/knowledge/${d._id}`,
      })),
      ...news.map((d) => ({
        id: d._id,
        type: 'news',
        label: 'News',
        title: d.title,
        description: d.description,
        photo: d.photo,
        href: `/news/${d._id}`,
      })),
      ...events.map((d) => ({
        id: d._id,
        type: 'events',
        label: 'Events',
        title: d.title,
        description: d.description,
        photo: d.photo,
        href: `/events/${d._id}`,
      })),
      ...positions.map((d) => ({
        id: d._id,
        type: 'position',
        label: 'Hiring',
        title: d.title,
        description: d.description,
        photo: null,
        href: `/position/${d._id}`,
      })),
    ]

    return res.json({ results, q })
  } catch (e) {
    console.log(e)
    return res.status(500).json({ msg: 'server error' })
  }
})

module.exports = router
