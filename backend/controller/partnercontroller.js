const mongoose = require('mongoose')
const Partner = require('../model/Partner')
let removeFile = require('../helpers/removeFile')
const { parseBool, excludeHidden } = require('../helpers/visibility')
const {
  ORDER_SORT,
  makeReorderHandler,
  makeMoveHandler,
  makeSwitchHandler,
  makeNormalizeHandler,
} = require('../helpers/catalogOrder')

let partnercontroller = {
  index: async (req, res) => {
    try {
      let partners = await Partner.find({}).sort(ORDER_SORT)
      res.set('Cache-Control', 'no-store')
      return res.json({ data: partners })
    } catch (e) {
      return res.status(500).json({ msg: 'server error' })
    }
  },

  publicIndex: async (req, res) => {
    try {
      let partners = await Partner.find(excludeHidden({}))
        .sort(ORDER_SORT)
        .select('name photo order')
      return res.json({ data: partners })
    } catch (e) {
      return res.status(500).json({ msg: 'server error' })
    }
  },

  store: async (req, res) => {
    try {
      let { order, hidden, name } = req.body
      let partner = await Partner.create({
        name: typeof name === 'string' ? name.trim() : '',
        order: Number.isFinite(Number(order)) ? Number(order) : 0,
        hidden: parseBool(hidden, false),
      })
      return res.json(partner)
    } catch (e) {
      return res.status(500).json({ msg: 'Failed to create partner' })
    }
  },

  show: async (req, res) => {
    try {
      let id = req.params.id
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ msg: 'Invalid partner ID' })
      }
      let partner = await Partner.findById(id)
      if (!partner) {
        return res.status(404).json({ msg: 'Partner not found' })
      }
      return res.json(partner)
    } catch (e) {
      return res.status(500).json({ msg: 'server error' })
    }
  },

  update: async (req, res) => {
    try {
      let id = req.params.id
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ msg: 'Invalid partner ID' })
      }
      let updateData = { ...req.body }
      if (updateData.hidden !== undefined) {
        updateData.hidden = parseBool(updateData.hidden, false)
      }
      if (updateData.order !== undefined) {
        updateData.order = Number.isFinite(Number(updateData.order))
          ? Number(updateData.order)
          : 0
      }
      if (updateData.name !== undefined) {
        updateData.name =
          typeof updateData.name === 'string' ? updateData.name.trim() : ''
      }
      delete updateData.photo
      let partner = await Partner.findByIdAndUpdate(id, updateData, {
        new: true,
      })
      if (!partner) {
        return res.status(404).json({ msg: 'Partner not found' })
      }
      return res.json(partner)
    } catch (e) {
      return res.status(500).json({ msg: 'server error' })
    }
  },

  toggleHidden: async (req, res) => {
    try {
      let id = req.params.id
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ msg: 'Invalid partner ID' })
      }
      let partner = await Partner.findById(id)
      if (!partner) {
        return res.status(404).json({ msg: 'Partner not found' })
      }
      partner.hidden = !partner.hidden
      await partner.save()
      return res.json(partner)
    } catch (e) {
      return res.status(500).json({ msg: 'server error' })
    }
  },

  reorder: makeReorderHandler(Partner, ORDER_SORT, 'partners'),
  normalizeOrders: makeNormalizeHandler(Partner, ORDER_SORT, 'partners'),
  move: makeMoveHandler(Partner, ORDER_SORT, 'partners'),
  switch: makeSwitchHandler(Partner, ORDER_SORT, 'partners'),

  destroy: async (req, res) => {
    try {
      let id = req.params.id
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ msg: 'Invalid partner ID' })
      }
      let partner = await Partner.findByIdAndDelete(id)
      if (!partner) {
        return res.status(404).json({ msg: 'Partner not found' })
      }
      if (partner.photo) {
        await removeFile(__dirname + '/../public' + partner.photo)
      }
      return res.json(partner)
    } catch (e) {
      return res.status(500).json({ msg: 'server error' })
    }
  },

  upload: async (req, res) => {
    try {
      let id = req.params.id
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ msg: 'Invalid partner ID' })
      }
      if (!req.file) {
        return res.status(400).json({ msg: 'Please choose an image' })
      }
      let existing = await Partner.findById(id)
      if (!existing) {
        return res.status(404).json({ msg: 'Partner not found' })
      }
      if (existing.photo) {
        await removeFile(__dirname + '/../public' + existing.photo)
      }
      let partner = await Partner.findByIdAndUpdate(
        id,
        { photo: '/' + req.file.filename },
        { new: true }
      )
      return res.json(partner)
    } catch (e) {
      return res.status(500).json({ msg: 'Failed to upload image' })
    }
  },
}

module.exports = partnercontroller
