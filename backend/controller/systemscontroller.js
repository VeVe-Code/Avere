const { default: mongoose } = require("mongoose")
const Systems = require("../model/Systems")
let removeFile = require('../helpers/removeFile')
const { parseBool, excludeHidden } = require('../helpers/visibility')

async function listSystems(req, res, { publicOnly = false } = {}) {
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
    let systems = await Systems.find(query).populate('category', 'title').skip((page - 1) * limit).limit(limit).sort({ createdAt: -1 })
    let totalsystems = await Systems.countDocuments(query)
    let totalPage = Math.max(1, Math.ceil(totalsystems / limit))

    let links = {
      nextPage: page < totalPage,
      PrevPage: page > 1,
      currentPage: page,
      loopsablelinks: []
    }

    for (let index = 0; index < totalPage; index++) {
      let number = index + 1
      links.loopsablelinks.push({ number })
    }

    return res.json({
      data: systems,
      links
    })
  } catch (e) {
    return res.status(500).json({ msg: "server error" })
  }
}

let systemscontroller = {

  index: async (req, res) => listSystems(req, res, { publicOnly: false }),
  publicIndex: async (req, res) => listSystems(req, res, { publicOnly: true }),

  store: async (req, res) => {
    try {
      let { title, description, about, category, hidden } = req.body
      let system = await Systems.create({
        title,
        description,
        about,
        category,
        hidden: parseBool(hidden, false)
      })
      return res.json(system)
    }
    catch (e) {
      return res.status(500).json({ msg: "server error" })
    }
  },
  show: async (req, res) => {
    try {
      let id = req.params.id
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ msg: "Invalid Id" })
      }
      let system = await Systems.findById(id)
      if (!system) {
        return res.status(404).json({ msg: "system not Found" })
      }
      return res.json(system)
    } catch (e) {
      return res.status(500).json({ msg: "server error" })
    }
  },
  publicShow: async (req, res) => {
    try {
      let id = req.params.id
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ msg: "Invalid Id" })
      }
      let system = await Systems.findById(id)
      if (!system || system.hidden) {
        return res.status(404).json({ msg: "system not Found" })
      }
      return res.json(system)
    } catch (e) {
      return res.status(500).json({ msg: "server error" })
    }
  },
  destroy: async (req, res) => {
    try {
      let id = req.params.id

      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ msg: "Invalid Id" })
      }

      let system = await Systems.findByIdAndDelete(id)

      if (!system) {
        return res.status(404).json({ msg: "system not Found" })
      }

      if (system.photo) {
        await removeFile(__dirname + '/../public' + system.photo)
      }

      return res.json(system)
    } catch (e) {
      console.log(e)
      return res.status(500).json({ msg: "server error" })
    }
  },

  update: async (req, res) => {
    try {
      let id = req.params.id

      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ msg: "Invalid Id" })
      }

      let updateData = { ...req.body };

      if (!updateData.category || updateData.category === "") {
        delete updateData.category;
      }
      if (updateData.hidden !== undefined) {
        updateData.hidden = parseBool(updateData.hidden, false);
      }
      delete updateData.photo;

      let system = await Systems.findByIdAndUpdate(id, updateData, { new: true });

      if (!system) {
        return res.status(404).json({ msg: "system not Found" })
      }

      return res.json(system)
    } catch (e) {
      console.log(e)
      return res.status(500).json({ msg: "server error" })
    }
  },

  toggleHidden: async (req, res) => {
    try {
      let id = req.params.id
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ msg: "Invalid Id" })
      }
      let system = await Systems.findById(id)
      if (!system) {
        return res.status(404).json({ msg: "system not Found" })
      }
      system.hidden = !system.hidden
      await system.save()
      return res.json(system)
    } catch (e) {
      return res.status(500).json({ msg: "server error" })
    }
  },

  upload: async (req, res) => {
    try {
      let id = req.params.id

      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ msg: "Invalid  ID" })
      }

      if (!req.file) {
        return res.status(400).json({ msg: "No file uploaded" })
      }

      const imagePath = "/" + req.file.filename

      let system = await Systems.findByIdAndUpdate(
        id,
        { photo: imagePath },
        { new: true }
      )

      if (!system) {
        return res.status(404).json({ msg: "System not found" })
      }

      return res.json(system)

    } catch (e) {
      console.log(e)
      return res.status(500).json({ msg: "server error" })
    }
  }
}
module.exports = systemscontroller
