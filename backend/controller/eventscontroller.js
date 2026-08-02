const mongoose = require("mongoose");
const Events = require("../model/Events");
let removeFile = require('../helpers/removeFile');
const { parseBool, excludeHidden } = require('../helpers/visibility');

async function listEvents(req, res, { publicOnly = false } = {}) {
  try {
    const title = req.query.title || "";
    let query = title
      ? { title: { $regex: new RegExp(title, "i") } }
      : {};
    if (publicOnly) query = excludeHidden(query);

    let limit = 6;
    let page = parseInt(req.query.page, 10) || 1;
    let events = await Events.find(query)
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 });
    let totalEvents = await Events.countDocuments(query);
    let totalPages = Math.max(1, Math.ceil(totalEvents / limit));
    let Links = {
      nextPage: page >= totalPages ? false : true,
      PrevPage: page === 1 ? false : true,
      currentPage: page,
      LoopableLinks: []
    };

    for (let index = 0; index < totalPages; index++) {
      Links.LoopableLinks.push({ number: index + 1 });
    }

    return res.json({ data: events, Links });
  } catch (e) {
    return res.status(500).json({ msg: "server error" });
  }
}

let eventscontroller = {
  index: async (req, res) => listEvents(req, res, { publicOnly: false }),
  publicIndex: async (req, res) => listEvents(req, res, { publicOnly: true }),

  store: async (req, res) => {
    try {
      let { title, description, about, hidden } = req.body;
      let events = await Events.create({
        title,
        description,
        about,
        hidden: parseBool(hidden, false)
      });
      return res.json(events);
    } catch (e) {
      return res.status(500).json({ msg: "Failed to create events" });
    }
  },

  show: async (req, res) => {
    try {
      let id = req.params.id;
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ msg: "Invalid events ID" });
      }
      let events = await Events.findById(id);
      if (!events) {
        return res.status(404).json({ msg: "Events not found" });
      }
      return res.json(events);
    } catch (e) {
      return res.status(500).json({ msg: "server error" });
    }
  },

  publicShow: async (req, res) => {
    try {
      let id = req.params.id;
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ msg: "Invalid events ID" });
      }
      let events = await Events.findById(id);
      if (!events || events.hidden) {
        return res.status(404).json({ msg: "Events not found" });
      }
      return res.json(events);
    } catch (e) {
      return res.status(500).json({ msg: "server error" });
    }
  },

  update: async (req, res) => {
    try {
      let id = req.params.id;
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ msg: "Invalid events ID" });
      }
      let updateData = { ...req.body };
      if (updateData.hidden !== undefined) {
        updateData.hidden = parseBool(updateData.hidden, false);
      }
      // don't wipe photo via body
      delete updateData.photo;
      let events = await Events.findByIdAndUpdate(id, updateData, { new: true });
      if (!events) {
        return res.status(404).json({ msg: "Events not found" });
      }
      return res.json(events);
    } catch (e) {
      return res.status(500).json({ msg: "server error" });
    }
  },

  toggleHidden: async (req, res) => {
    try {
      let id = req.params.id;
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ msg: "Invalid events ID" });
      }
      let events = await Events.findById(id);
      if (!events) {
        return res.status(404).json({ msg: "Events not found" });
      }
      events.hidden = !events.hidden;
      await events.save();
      return res.json(events);
    } catch (e) {
      return res.status(500).json({ msg: "server error" });
    }
  },

  destroy: async (req, res) => {
    try {
      let id = req.params.id;
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ msg: "Invalid events ID" });
      }
      let events = await Events.findByIdAndDelete(id);
      if (!events) {
        return res.status(404).json({ msg: "Events not found" });
      }
      if (events.photo) {
        await removeFile(__dirname + '/../public' + events.photo);
      }
      return res.json(events);
    } catch (e) {
      return res.status(500).json({ msg: "server error" });
    }
  },

  upload: async (req, res) => {
    try {
      let id = req.params.id;
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ msg: "Invalid events ID" });
      }
      let events = await Events.findByIdAndUpdate(id, {
        photo: '/' + req.file.filename
      }, { new: true });
      if (!events) {
        return res.status(404).json({ msg: "Events not found" });
      }
      return res.json(events);
    } catch (e) {
      return res.status(500).json({ msg: "server error" });
    }
  }
};

module.exports = eventscontroller;
