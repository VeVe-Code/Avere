const { default: mongoose } = require('mongoose')
const Category = require('../model/Category')
const {
  PRODUCT_CATEGORIES,
  PRODUCT_CATEGORY_META,
  isValidProductCategory,
  groupProductsByCategory,
} = require('../helpers/productCategories')

let categorycontroller = {
  categories: async (_req, res) => {
    return res.json({
      categories: PRODUCT_CATEGORIES,
      meta: PRODUCT_CATEGORY_META,
    })
  },

  index: async (req, res) => {
    try {
      let filter = {}
      if (req.query.category && isValidProductCategory(req.query.category)) {
        filter.category = req.query.category
      }
      let categories = await Category.find(filter).sort({ category: 1, title: 1 })
      return res.json(categories)
    } catch (e) {
      return res.status(500).json({ msg: 'server error' })
    }
  },

  publicIndex: async (req, res) => {
    try {
      let filter = {}
      if (req.query.category && isValidProductCategory(req.query.category)) {
        filter.category = req.query.category
      }
      let categories = await Category.find(filter).sort({ category: 1, title: 1 })
      return res.json({
        data: categories,
        groups: groupProductsByCategory(categories),
        categories: PRODUCT_CATEGORIES,
        meta: PRODUCT_CATEGORY_META,
      })
    } catch (e) {
      return res.status(500).json({ msg: 'server error' })
    }
  },

  store: async (req, res) => {
    try {
      let title = typeof req.body.title === 'string' ? req.body.title.trim() : ''
      let category = req.body.category
      if (!title) {
        return res.status(400).json({ msg: 'Product title is required' })
      }
      if (!isValidProductCategory(category)) {
        return res.status(400).json({ msg: 'Please select a valid category' })
      }
      let doc = await Category.create({ title, category })
      return res.json(doc)
    } catch (e) {
      return res.status(500).json({ msg: 'server error' })
    }
  },

  show: async (req, res) => {
    try {
      let id = req.params.id
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ msg: 'Invalid Category ID' })
      }
      let category = await Category.findById(id)
      if (!category) {
        return res.status(404).json({ msg: 'not found Category' })
      }
      return res.json(category)
    } catch (e) {
      return res.status(500).json({ msg: 'server error' })
    }
  },

  update: async (req, res) => {
    try {
      let id = req.params.id

      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ msg: 'Invalid Category ID' })
      }

      let update = {}
      if (req.body.title !== undefined) {
        update.title =
          typeof req.body.title === 'string' ? req.body.title.trim() : ''
        if (!update.title) {
          return res.status(400).json({ msg: 'Product title is required' })
        }
      }
      if (req.body.category !== undefined) {
        if (!isValidProductCategory(req.body.category)) {
          return res.status(400).json({ msg: 'Please select a valid category' })
        }
        update.category = req.body.category
      }

      const category = await Category.findByIdAndUpdate(id, update, {
        new: true,
        runValidators: true,
      })

      if (!category) {
        return res.status(404).json({ msg: 'Category not found' })
      }

      return res.status(200).json(category)
    } catch (e) {
      return res.status(500).json({ msg: 'Server error' })
    }
  },

  destory: async (req, res) => {
    try {
      let id = req.params.id
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ msg: 'Invalid Category ID' })
      }
      let category = await Category.findByIdAndDelete(id)
      if (!category) {
        return res.status(404).json({ msg: 'not found Category' })
      }
      return res.json(category)
    } catch (e) {
      return res.status(500).json({ msg: 'server error' })
    }
  },
}

module.exports = categorycontroller
