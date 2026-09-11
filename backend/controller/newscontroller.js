const mongoose = require("mongoose");
const News = require("../model/News");
let removeFile = require('../helpers/removeFile');
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
  parseDisplayDate,
} = require('../helpers/catalogSort');

function parseBool(value, fallback = false) {
  if (value === undefined || value === null || value === "") return fallback;
  if (typeof value === "boolean") return value;
  if (typeof value === "string") {
    let v = value.toLowerCase().trim();
    if (v === "true" || v === "1" || v === "yes") return true;
    if (v === "false" || v === "0" || v === "no") return false;
  }
  return Boolean(value);
}

function buildListQuery(req, { publicOnly = false } = {}) {
  const title = req.query.title || "";
  const query = title
    ? { title: { $regex: new RegExp(title, "i") } }
    : {};

  if (publicOnly) {
    query.hidden = { $ne: true };
  }

  return query;
}

async function listNews(req, res, { publicOnly = false } = {}) {
  try {
    const query = buildListQuery(req, { publicOnly });

    let limit = 6;
    let page = parseInt(req.query.page, 10) || 1;
    const sort = await resolveListSort('news', { publicOnly });

    let newsItem = await News.find(query)
      .skip((page - 1) * limit)
      .limit(limit)
      .sort(sort);

    let totalNews = await News.countDocuments(query);
    let totalPages = Math.max(1, Math.ceil(totalNews / limit));

    let Links = {
      nextPage: page >= totalPages ? false : true,
      PrevPage: page === 1 ? false : true,
      currentPage: page,
      LoopableLinks: []
    };

    for (let i = 0; i < totalPages; i++) {
      Links.LoopableLinks.push({ number: i + 1 });
    }

    res.set('Cache-Control', 'no-store')
    const payload = { data: newsItem, Links }
    if (!publicOnly) payload.sortMode = await getSortMode('news')
    return res.json(payload);
  } catch (e) {
    console.log(e);
    return res.status(500).json({ msg: "server error" });
  }
}

let newscontroller = {

  /* ================= INDEX (admin — all posts) ================= */
  index: async (req, res) => {
    return listNews(req, res, { publicOnly: false });
  },

  /* ================= PUBLIC INDEX (visible only) ================= */
  publicIndex: async (req, res) => {
    return listNews(req, res, { publicOnly: true });
  },

  /* ================= STORE ================= */
  store: async (req, res) => {
    try {
      let { title, description, about, sections, hidden, pinned, order } = req.body;

      let newsItem = await News.create({
        title,
        description,
        about,
        hidden: parseBool(hidden, false),
        pinned: parseBool(pinned, false),
        order: parseOrderField(order, 0),
        displayDate: displayDateForCreate(req.body),
        sections: sections ? JSON.parse(sections) : []
      });

      return res.json(newsItem);

    } catch (e) {
      console.log(e);
      return res.status(500).json({ msg: "Failed to create news" });
    }
  },

  /* ================= SHOW (admin) ================= */
  show: async (req, res) => {
    try {
      let id = req.params.id;

      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ msg: "Invalid ID" });
      }

      let newsItem = await News.findById(id);

      if (!newsItem) {
        return res.status(404).json({ msg: "Not found" });
      }

      return res.json(newsItem);

    } catch (e) {
      return res.status(500).json({ msg: "server error" });
    }
  },

  /* ================= PUBLIC SHOW ================= */
  publicShow: async (req, res) => {
    try {
      let id = req.params.id;

      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ msg: "Invalid ID" });
      }

      let newsItem = await News.findById(id);

      if (!newsItem || newsItem.hidden) {
        return res.status(404).json({ msg: "Not found" });
      }

      return res.json(newsItem);

    } catch (e) {
      return res.status(500).json({ msg: "server error" });
    }
  },

  /* ================= UPDATE ================= */
  update: async (req, res) => {
    try {
      let id = req.params.id;

      let { title, description, about, sections, hidden, pinned, order } = req.body;

      let newsItem = await News.findById(id);

      if (!newsItem) {
        return res.status(404).json({ msg: "Not found" });
      }

      newsItem.title = title;
      newsItem.description = description;
      newsItem.about = about;

      if (hidden !== undefined) {
        newsItem.hidden = parseBool(hidden, newsItem.hidden);
      }
      if (pinned !== undefined) {
        newsItem.pinned = parseBool(pinned, newsItem.pinned);
      }
      if (order !== undefined) {
        newsItem.order = parseOrderField(order, newsItem.order ?? 0);
      }
      if (req.body.displayDate !== undefined) {
        const parsed = parseDisplayDate(req.body.displayDate)
        if (parsed) newsItem.displayDate = parsed
      }

      if (sections) {
        const newSections = JSON.parse(sections);

        newsItem.sections = newSections.map((sec, index) => ({
          title: sec.title || "",
          description: sec.description || "",
          detail: sec.detail || "",
          photo: sec.photo || newsItem.sections[index]?.photo || null
        }));
      }

      await newsItem.save();

      return res.json(newsItem);

    } catch (e) {
      console.log(e);
      return res.status(500).json({ msg: "server error" });
    }
  },

  /* ================= TOGGLE HIDDEN ================= */
  toggleHidden: async (req, res) => {
    try {
      let id = req.params.id;

      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ msg: "Invalid ID" });
      }

      let newsItem = await News.findById(id);

      if (!newsItem) {
        return res.status(404).json({ msg: "Not found" });
      }

      newsItem.hidden = !newsItem.hidden;
      await newsItem.save();

      return res.json(newsItem);
    } catch (e) {
      console.log(e);
      return res.status(500).json({ msg: "server error" });
    }
  },

  togglePinned: makeTogglePinnedHandler(News, 'Not found'),
  reorder: makeReorderHandler(News, ORDER_SORT, 'news posts'),
  normalizeOrders: makeNormalizeHandler(News, ORDER_SORT, 'news posts'),
  move: makeMoveHandler(News, ORDER_SORT, 'news posts'),
  switch: makeSwitchHandler(News, ORDER_SORT, 'news posts'),

  /* ================= DELETE ================= */
  destroy: async (req, res) => {
    try {
      let id = req.params.id;

      let newsItem = await News.findByIdAndDelete(id);

      if (!newsItem) {
        return res.status(404).json({ msg: "Not found" });
      }

      if (newsItem.photo) {
        await removeFile(__dirname + '/../public' + newsItem.photo);
      }

      newsItem.sections?.forEach(sec => {
        if (sec.photo) {
          removeFile(__dirname + '/../public' + sec.photo);
        }
      });

      return res.json(newsItem);

    } catch (e) {
      return res.status(500).json({ msg: "server error" });
    }
  },

  /* ================= MAIN IMAGE ================= */
  upload: async (req, res) => {
    try {
      let newsItem = await News.findById(req.params.id);

      if (!newsItem) {
        return res.status(404).json({ msg: "Not found" });
      }

      if (req.file && newsItem.photo) {
        await removeFile(__dirname + '/../public' + newsItem.photo);
      }

      if (req.file) {
     newsItem.photo = '/' + req.file.filename;
      }

      await newsItem.save();

      return res.json(newsItem);

    } catch (e) {
      return res.status(500).json({ msg: "server error" });
    }
  },

  /* ================= SECTION IMAGES ================= */
  uploadSections: async (req, res) => {
    try {
      let newsItem = await News.findById(req.params.id);

      if (!newsItem) {
        return res.status(404).json({ msg: "Not found" });
      }

      if (!newsItem.sections || newsItem.sections.length === 0) {
        return res.json(newsItem);
      }

      let indexes = [];
      try {
        indexes = req.body.indexes ? JSON.parse(req.body.indexes) : [];
      } catch (err) {
        indexes = [];
      }

      req.files.forEach((file, i) => {
        let sectionIndex =
          typeof indexes[i] === "number" ? indexes[i] : i;

        if (newsItem.sections[sectionIndex]) {
          if (newsItem.sections[sectionIndex].photo) {
            removeFile(
              __dirname + "/../public" + newsItem.sections[sectionIndex].photo
            );
          }
          newsItem.sections[sectionIndex].photo = "/" + file.filename;
        }
      });

      await newsItem.save();

      return res.json(newsItem);

    } catch (e) {
      console.log(e);
      return res.status(500).json({ msg: "server error" });
    }
  }

};

module.exports = newscontroller;
