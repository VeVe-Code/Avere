const Services = require("../model/Services");
const mongoose = require("mongoose");
let removeFile = require('../helpers/removeFile')
const { parseBool, excludeHidden } = require('../helpers/visibility')

async function listServices(req, res, { publicOnly = false } = {}) {
  try {
    const title = req.query.title || "";
    const category = req.query.category || null;

    let query = {};

    if (title) {
      query.name = { $regex: new RegExp(title, "i") };
    }

    if (category) {
      query.category = category;
    }

    if (publicOnly) query = excludeHidden(query);

    const limit = 6;
    const page = Number(req.query.page) || 1;

    const services = await Services.find(query)
      .populate('category', 'title')
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 });

    const totalServices = await Services.countDocuments(query);
    const totalPages = Math.max(1, Math.ceil(totalServices / limit));

    let links = {
      nextPage: page < totalPages,
      prevPage: page > 1,
      currentPage: page,
      loopablelinks: []
    };

    for (let i = 1; i <= totalPages; i++) {
      links.loopablelinks.push({ number: i });
    }

    return res.json({
      links,
      data: services
    });
  } catch (e) {
    return res.status(500).json({ msg: "server error" });
  }
}

let serviceController = {
  index: async (req, res) => listServices(req, res, { publicOnly: false }),
  publicIndex: async (req, res) => listServices(req, res, { publicOnly: true }),

  show: async (req, res) => {
    try {
      let id = req.params.id;

      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ msg: "Invalid service ID" });
      }

      let service = await Services.findById(id)

      if (!service) {
        return res.status(404).json({ msg: "Service not found" });
      }

      return res.json(service);
    } catch (e) {
      return res.status(500).json({ msg: "server error" });
    }
  },

  publicShow: async (req, res) => {
    try {
      let id = req.params.id;

      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ msg: "Invalid service ID" });
      }

      let service = await Services.findById(id)

      if (!service || service.hidden) {
        return res.status(404).json({ msg: "Service not found" });
      }

      return res.json(service);
    } catch (e) {
      return res.status(500).json({ msg: "server error" });
    }
  },

  create: async (req, res) => {
    try {
      let { name, description, about, category, hidden } = req.body;
      let service = await Services.create({
        name,
        description,
        about,
        category,
        hidden: parseBool(hidden, false)
      })
      return res.json(service)
    } catch (e) {
      return res.status(500).json({ msg: "Failed to create service" })
    }
  },
  update: async (req, res) => {
    try {
      let id = req.params.id;

      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ msg: "Invalid service ID" });
      }

      let updateData = { ...req.body };
      if (updateData.hidden !== undefined) {
        updateData.hidden = parseBool(updateData.hidden, false);
      }
      delete updateData.photo;

      let service = await Services.findByIdAndUpdate(id, updateData, { new: true });

      if (!service) {
        return res.status(404).json({ msg: "Service not found" });
      }

      return res.json(service);
    } catch (e) {
      return res.status(500).json({ msg: "server error" });
    }
  },

  toggleHidden: async (req, res) => {
    try {
      let id = req.params.id;
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ msg: "Invalid service ID" });
      }
      let service = await Services.findById(id);
      if (!service) {
        return res.status(404).json({ msg: "Service not found" });
      }
      service.hidden = !service.hidden;
      await service.save();
      return res.json(service);
    } catch (e) {
      return res.status(500).json({ msg: "server error" });
    }
  },

  destory: async (req, res) => {
    try {
      let id = req.params.id;

      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ msg: "Invalid service ID" });
      }

      let service = await Services.findByIdAndDelete(id);
      if (!service) {
        return res.status(404).json({ msg: "Service not found" });
      }
      if (service.photo) {
        await removeFile(__dirname + '/../public' + service.photo)
      }

      return res.json(service);
    } catch (e) {
      return res.status(500).json({ msg: "server error" });
    }
  },
  upload: async (req, res) => {
    try {
      let id = req.params.id

      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ msg: "Invalid service ID" })
      }

      if (!req.file) {
        return res.status(400).json({ msg: "No file uploaded" })
      }

      const imagePath = "/" + req.file.filename

      let service = await Services.findByIdAndUpdate(
        id,
        { photo: imagePath },
        { new: true }
      )

      if (!service) {
        return res.status(404).json({ msg: "Service not found" })
      }

      return res.json(service)

    } catch (e) {
      console.log(e)
      return res.status(500).json({ msg: "server error" })
    }
  }

}

module.exports = serviceController;
