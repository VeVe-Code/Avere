const mongoose = require('mongoose')
const HeroSlide = require('../model/HeroSlide')
let removeFile = require('../helpers/removeFile')
const { parseBool, excludeHidden } = require('../helpers/visibility')
const {
  ORDER_SORT,
  makeReorderHandler,
  makeMoveHandler,
  makeSwitchHandler,
  makeNormalizeHandler,
} = require('../helpers/catalogOrder')

function clampDurationSeconds(value, fallback = 7) {
  let n = Number(value)
  if (!Number.isFinite(n)) return fallback
  let i = Math.round(n)
  if (i < 5 || i > 10) return fallback
  return i
}

let heroslidecontroller = {
  index: async (req, res) => {
    try {
      let slides = await HeroSlide.find({}).sort(ORDER_SORT)
      res.set('Cache-Control', 'no-store')
      return res.json({ data: slides })
    } catch (e) {
      return res.status(500).json({ msg: 'server error' })
    }
  },

  publicIndex: async (req, res) => {
    try {
      let slides = await HeroSlide.find(excludeHidden({}))
        .sort(ORDER_SORT)
        .select('photo order durationSeconds')
      return res.json({ data: slides })
    } catch (e) {
      return res.status(500).json({ msg: 'server error' })
    }
  },

  store: async (req, res) => {
    try {
      let { order, hidden, durationSeconds } = req.body
      let slide = await HeroSlide.create({
        order: Number.isFinite(Number(order)) ? Number(order) : 0,
        hidden: parseBool(hidden, false),
        durationSeconds: clampDurationSeconds(durationSeconds, 7),
      })
      return res.json(slide)
    } catch (e) {
      return res.status(500).json({ msg: 'Failed to create hero slide' })
    }
  },

  show: async (req, res) => {
    try {
      let id = req.params.id
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ msg: 'Invalid hero slide ID' })
      }
      let slide = await HeroSlide.findById(id)
      if (!slide) {
        return res.status(404).json({ msg: 'Hero slide not found' })
      }
      return res.json(slide)
    } catch (e) {
      return res.status(500).json({ msg: 'server error' })
    }
  },

  update: async (req, res) => {
    try {
      let id = req.params.id
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ msg: 'Invalid hero slide ID' })
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
      if (updateData.durationSeconds !== undefined) {
        updateData.durationSeconds = clampDurationSeconds(
          updateData.durationSeconds,
          7
        )
      }
      delete updateData.photo
      let slide = await HeroSlide.findByIdAndUpdate(id, updateData, { new: true })
      if (!slide) {
        return res.status(404).json({ msg: 'Hero slide not found' })
      }
      return res.json(slide)
    } catch (e) {
      return res.status(500).json({ msg: 'server error' })
    }
  },

  toggleHidden: async (req, res) => {
    try {
      let id = req.params.id
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ msg: 'Invalid hero slide ID' })
      }
      let slide = await HeroSlide.findById(id)
      if (!slide) {
        return res.status(404).json({ msg: 'Hero slide not found' })
      }
      slide.hidden = !slide.hidden
      await slide.save()
      return res.json(slide)
    } catch (e) {
      return res.status(500).json({ msg: 'server error' })
    }
  },

  reorder: makeReorderHandler(HeroSlide, ORDER_SORT, 'hero slides'),
  normalizeOrders: makeNormalizeHandler(HeroSlide, ORDER_SORT, 'hero slides'),
  move: makeMoveHandler(HeroSlide, ORDER_SORT, 'hero slides'),
  switch: makeSwitchHandler(HeroSlide, ORDER_SORT, 'hero slides'),

  destroy: async (req, res) => {
    try {
      let id = req.params.id
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ msg: 'Invalid hero slide ID' })
      }
      let slide = await HeroSlide.findByIdAndDelete(id)
      if (!slide) {
        return res.status(404).json({ msg: 'Hero slide not found' })
      }
      if (slide.photo) {
        await removeFile(__dirname + '/../public' + slide.photo)
      }
      return res.json(slide)
    } catch (e) {
      return res.status(500).json({ msg: 'server error' })
    }
  },

  upload: async (req, res) => {
    try {
      let id = req.params.id
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ msg: 'Invalid hero slide ID' })
      }
      if (!req.file) {
        return res.status(400).json({ msg: 'Please choose an image' })
      }
      let existing = await HeroSlide.findById(id)
      if (!existing) {
        return res.status(404).json({ msg: 'Hero slide not found' })
      }
      if (existing.photo) {
        await removeFile(__dirname + '/../public' + existing.photo)
      }
      let slide = await HeroSlide.findByIdAndUpdate(
        id,
        { photo: '/' + req.file.filename },
        { new: true }
      )
      return res.json(slide)
    } catch (e) {
      return res.status(500).json({ msg: 'Failed to upload image' })
    }
  },
}

module.exports = heroslidecontroller
