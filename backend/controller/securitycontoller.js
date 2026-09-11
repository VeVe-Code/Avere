const { default: mongoose } = require("mongoose")
const Security = require("../model/Security")
let removeFile = require('../helpers/removeFile')
const { parseBool, excludeHidden } = require('../helpers/visibility')
const {
  CATALOG_SORT,
  ORDER_SORT,
  makeReorderHandler,
  makeTogglePinnedHandler,
  makeMoveHandler,
  makeSwitchHandler,
  makeNormalizeHandler,
  parseOrderField,
} = require('../helpers/catalogOrder')
const {
  resolveListSort,
  getSortMode,
  displayDateForCreate,
  applyDisplayDateUpdate,
} = require('../helpers/catalogSort')

async function listSecurity(req, res, { publicOnly = false } = {}) {
  try {
    const title = req.query.title || "";
    const category = req.query.category || null
    let query = title
      ? { title: { $regex: new RegExp(title, "i") } }
      : {};
    if (category) {
      query.category = category
    }
    if (publicOnly) query = excludeHidden(query);

    let limit = 6
    let page = parseInt(req.query.page, 10) || 1
    const sort = await resolveListSort('security', { publicOnly })
    let security = await Security.find(query).populate('category', 'title').skip((page - 1) * limit).limit(limit).sort(sort)
    let totalsecurity = await Security.countDocuments(query)
    let totalPages = Math.max(1, Math.ceil(totalsecurity / limit))
    let links = {
      nextPage: page < totalPages,
      PrevPage: page > 1,
      currentPage: page,
      Loopablelinks: []
    }

    for (let index = 0; index < totalPages; index++) {
      let number = index + 1
      links.Loopablelinks.push({ number });
    }

    res.set('Cache-Control', 'no-store')
    const payload = { data: security, links }
    if (!publicOnly) payload.sortMode = await getSortMode('security')
    return res.json(payload)
  } catch (e) {
    return res.status(500).json({ msg: "server error" })
  }
}

let securitycontroller = {
  index: async (req, res) => listSecurity(req, res, { publicOnly: false }),
  publicIndex: async (req, res) => listSecurity(req, res, { publicOnly: true }),

  store: async (req, res) => {
    try {
      let { title, description, about, category, hidden, pinned, order } = req.body
      let security = await Security.create({
        title,
        description,
        about,
        category,
        hidden: parseBool(hidden, false),
        pinned: parseBool(pinned, false),
        order: parseOrderField(order, 0),
        displayDate: displayDateForCreate(req.body),
      })
      return res.json(security)
    } catch (e) {
      return res.status(500).json({ msg: "server error" })
    }
  },
  show: async (req, res) => {
    try {
      let id = req.params.id
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ msg: "invalid ID" })
      }
      let security = await Security.findById(id)
      if (!security) {
        return res.status(400).json({ msg: "not found Security" })
      }
      return res.json(security)
    } catch (error) {
      return res.status(500).json({ msg: "server error" })
    }
  },
  publicShow: async (req, res) => {
    try {
      let id = req.params.id
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ msg: "invalid ID" })
      }
      let security = await Security.findById(id)
      if (!security || security.hidden) {
        return res.status(404).json({ msg: "not found Security" })
      }
      return res.json(security)
    } catch (error) {
      return res.status(500).json({ msg: "server error" })
    }
  },
  destory: async (req, res) => {
    try {
      let id = req.params.id
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ msg: "invalid ID" })
      }
      let security = await Security.findByIdAndDelete(id)
      if (!security) {
        return res.status(400).json({ msg: "not found Security" })
      }
      if (security.photo) {
        await removeFile(__dirname + '/../public' + security.photo)
      }
      return res.json(security)
    } catch (error) {
      return res.status(500).json({ msg: "server error" })
    }
  },
  update: async (req, res) => {
    try {
      let id = req.params.id
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ msg: "invalid ID" })
      }

      let updateData = { ...req.body }
      if (updateData.hidden !== undefined) {
        updateData.hidden = parseBool(updateData.hidden, false)
      }
      if (updateData.pinned !== undefined) {
        updateData.pinned = parseBool(updateData.pinned, false)
      }
      if (updateData.order !== undefined) {
        updateData.order = parseOrderField(updateData.order, 0)
      }
      applyDisplayDateUpdate(updateData, req.body)
      delete updateData.photo

      let security = await Security.findByIdAndUpdate(id, updateData, { new: true })

      if (!security) {
        return res.status(400).json({ msg: "not found Security" })
      }

      return res.json(security)
    } catch (error) {
      return res.status(500).json({ msg: "server error" })
    }
  },

  toggleHidden: async (req, res) => {
    try {
      let id = req.params.id
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ msg: "invalid ID" })
      }
      let security = await Security.findById(id)
      if (!security) {
        return res.status(404).json({ msg: "not found Security" })
      }
      security.hidden = !security.hidden
      await security.save()
      return res.json(security)
    } catch (error) {
      return res.status(500).json({ msg: "server error" })
    }
  },

  togglePinned: makeTogglePinnedHandler(Security, 'not found Security'),
  reorder: makeReorderHandler(Security, ORDER_SORT, 'security items'),
  normalizeOrders: makeNormalizeHandler(Security, ORDER_SORT, 'security items'),
  move: makeMoveHandler(Security, ORDER_SORT, 'security items'),
  switch: makeSwitchHandler(Security, ORDER_SORT, 'security items'),

  upload: async (req, res) => {
    try {
      let id = req.params.id;

      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ msg: "Invalid Id" });
      }

      let oldData = await Security.findById(id);

      if (oldData && oldData.photo) {
        await removeFile(__dirname + '/../public' + oldData.photo);
      }

      let security = await Security.findByIdAndUpdate(id, {
        photo: '/' + req.file.filename
      }, { new: true });

      if (!security) {
        return res.status(404).json({ msg: "security data not Found" });
      }

      return res.json(security);
    } catch (e) {
      return res.status(500).json({ msg: "server error" });
    }
  }
}


module.exports = securitycontroller
