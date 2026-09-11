const mongoose = require("mongoose");
const Events = require("../model/Events");
let removeFile = require('../helpers/removeFile');
const { parseBool, excludeHidden } = require('../helpers/visibility');
const {
  CATALOG_SORT,
  ORDER_SORT,
  makeReorderHandler,
  makeTogglePinnedHandler,
  makeMoveHandler,
  makeSwitchHandler,
  makeNormalizeHandler,
  parseOrderField,
} = require('../helpers/catalogOrder');
const {
  resolveListSort,
  getSortMode,
  displayDateForCreate,
  applyDisplayDateUpdate,
} = require('../helpers/catalogSort');

async function listEvents(req, res, { publicOnly = false } = {}) {
  try {
    const title = req.query.title || "";
    let query = title
      ? { title: { $regex: new RegExp(title, "i") } }
      : {};
    if (publicOnly) query = excludeHidden(query);

    let limit = 6;
    let page = parseInt(req.query.page, 10) || 1;
    const sort = await resolveListSort('events', { publicOnly });
    let events = await Events.find(query)
      .skip((page - 1) * limit)
      .limit(limit)
      .sort(sort);
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

    res.set('Cache-Control', 'no-store')
    const payload = { data: events, Links }
    if (!publicOnly) payload.sortMode = await getSortMode('events')
    return res.json(payload);
  } catch (e) {
    return res.status(500).json({ msg: "server error" });
  }
}

let eventscontroller = {
  index: async (req, res) => listEvents(req, res, { publicOnly: false }),
  publicIndex: async (req, res) => listEvents(req, res, { publicOnly: true }),

  store: async (req, res) => {
    try {
      let { title, description, about, hidden, pinned, order } = req.body;
      let events = await Events.create({
        title,
        description,
        about,
        hidden: parseBool(hidden, false),
        pinned: parseBool(pinned, false),
        order: parseOrderField(order, 0),
        displayDate: displayDateForCreate(req.body),
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
      if (updateData.pinned !== undefined) {
        updateData.pinned = parseBool(updateData.pinned, false);
      }
      if (updateData.order !== undefined) {
        updateData.order = parseOrderField(updateData.order, 0);
      }
      applyDisplayDateUpdate(updateData, req.body)
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

  togglePinned: makeTogglePinnedHandler(Events, 'Events not found'),
  reorder: makeReorderHandler(Events, ORDER_SORT, 'events'),
  normalizeOrders: makeNormalizeHandler(Events, ORDER_SORT, 'events'),
  move: makeMoveHandler(Events, ORDER_SORT, 'events'),
  switch: makeSwitchHandler(Events, ORDER_SORT, 'events'),

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
